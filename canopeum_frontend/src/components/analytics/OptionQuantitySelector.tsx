/* eslint-disable react/jsx-props-no-spreading -- Needed for MUI custom input */
import './OptionQuantitySelector.scss'

import { Autocomplete } from '@mui/material'
import { useEffect, useState } from 'react'

type Props<TValue> = {
  readonly id: string,
  readonly label: string,
  readonly withQuantity?: boolean,
  readonly selected: SelectorOptionQuantity<TValue>[],
  readonly options: SelectorOption<TValue>[],
  readonly onChange: (selectedOptions: SelectorOptionQuantity<TValue>[]) => void,
}

type OptionQuantityValueType = number | string

export type SelectorOption<TValue> = {
  value: TValue,
  displayText: string,
}

export type SelectorOptionQuantity<TValue> = {
  option: SelectorOption<TValue>,
  quantity?: number,
}

const MINIMUM_QUANTITY = 1 // Makes it easy to refactor if we support a min input
const DEFAULT_QUANTITY = 1

const OptionQuantitySelector = <TValue extends OptionQuantityValueType>(
  { id, label, options, selected, withQuantity, onChange }: Props<TValue>,
) => {
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() =>
    setFilteredOptions(
      options.filter(value => value.displayText.toLowerCase().includes(searchValue.toLowerCase())),
    ), [searchValue, options])

  const onSelect = (option: SelectorOption<TValue>) => {
    setSearchValue('')
    const existingOptionIndex = selected.findIndex(optionQuantity =>
      optionQuantity.option.value === option.value
    )

    // Do nothing if already selected
    if (existingOptionIndex !== -1) return

    onChange([...selected, { option, quantity: DEFAULT_QUANTITY }])
  }

  const updateQuantity = (
    optionIndex: number,
    quantity: number,
    changeType: 'variation' | 'absolute' = 'variation',
  ) => {
    const updatedOption = { ...selected[optionIndex] }
    updatedOption.quantity = changeType === 'absolute'
      ? Math.max(quantity, MINIMUM_QUANTITY)
      : (updatedOption.quantity ?? MINIMUM_QUANTITY) + quantity

    // NOTE: Currently unusable since we always disable at minimum,
    // kept in case we wanna restore that behaviour
    // if (updatedOption.quantity <= 0) {
    //   removeOption(optionIndex)
    // } else {
    const updatedSelected = [...selected]
    updatedSelected[optionIndex] = updatedOption
    onChange(updatedSelected)
  }

  const removeOption = (optionIndex: number) => {
    const updatedSelected = [...selected]
    updatedSelected.splice(optionIndex, 1)
    onChange(updatedSelected)
  }

  return (
    <div className='position-relative'>
      <label className='form-label' htmlFor={id}>{label}</label>

      <Autocomplete
        autoSelect
        clearOnBlur
        freeSolo
        getOptionKey={option => (
          typeof (option) === 'string'
            ? option
            : option.value
        )}
        getOptionLabel={option => (
          typeof (option) === 'string'
            ? option
            : option.displayText
        )}
        id={id}
        onChange={(_event, option) => {
          if (option === null || typeof (option) === 'string') return

          onSelect(option)
        }}
        onClose={_event => setIsAutocompleteOpen(false)}
        onOpen={_event => setIsAutocompleteOpen(true)}
        open={isAutocompleteOpen}
        options={filteredOptions}
        renderInput={params => (
          <div
            className='option-quantity-selector-input-group'
            ref={params.InputProps.ref}
          >
            <input
              {...params.inputProps}
              className='form-control option-quantity-selector-input'
              onChange={event => setSearchValue(event.target.value)}
              type='text'
              value={searchValue}
            />
            <button
              className='unstyled-button h-100 d-flex justify-content-center align-items-center'
              onClick={() => setIsAutocompleteOpen(previous => !previous)}
              type='button'
            >
              <span className='material-symbols-outlined fill-icon icon-md'>
                {isAutocompleteOpen
                  ? 'expand_less'
                  : 'expand_more'}
              </span>
            </button>
          </div>
        )}
      />

      <ul className='list-group list-group-flush overflow-hidden mt-1'>
        {selected.map((optionQuantity, index) => (
          <li
            className='list-group-item row d-flex justify-content-between align-items-center'
            key={`selected-specie-${optionQuantity.option.value}`}
          >
            <div className='col-6'>{optionQuantity.option.displayText}</div>

            {withQuantity && (
              <div className='col-4'>
                <div className='d-flex justify-content-center align-items-center'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button p-1'
                    disabled={optionQuantity.quantity === MINIMUM_QUANTITY}
                    onClick={() => updateQuantity(index, -1)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-xs'>remove</span>
                  </button>

                  <input
                    className='form-control no-spinner'
                    onChange={event =>
                      updateQuantity(index, Number(event.target.value), 'absolute')}
                    style={{ width: '3.5rem', margin: '0 0.5rem' }}
                    type='number'
                    value={optionQuantity.quantity}
                  />

                  <button
                    className='btn btn-outline-dark btn-sm icon-button p-1'
                    onClick={() => updateQuantity(index, +1)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-xs'>add</span>
                  </button>
                </div>
              </div>
            )}

            <div className='col-2 d-flex justify-content-end'>
              <button
                className='unstyled-button icon-button p-0'
                onClick={() => removeOption(index)}
                type='button'
              >
                <span className='material-symbols-outlined'>cancel</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OptionQuantitySelector
