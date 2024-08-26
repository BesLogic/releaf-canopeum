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

const OptionQuantitySelector = <TValue extends OptionQuantityValueType>(
  { id, label, options, selected, withQuantity, onChange }: Props<TValue>,
) => {
  const [availableOptions, setAvailableOptions] = useState(options)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [selectedOptions, setSelectedOptions] = useState(selected)

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)

  const [searchValue, setSearchValue] = useState('')

  useEffect(() => setAvailableOptions(options), [options])
  useEffect(() => setFilteredOptions(availableOptions), [availableOptions])
  useEffect(() => onChange(selectedOptions), [selectedOptions, onChange])

  useEffect(() =>
    setFilteredOptions(
      availableOptions.filter(value =>
        value.displayText.toLowerCase().includes(searchValue.toLowerCase())
      ),
    ), [searchValue, availableOptions])

  const onSelect = (option: SelectorOption<TValue>) => {
    setSearchValue('')
    setSelectedOptions(current => [...current, { option, quantity: 0 }])
    setAvailableOptions(current =>
      current.filter(currentOption => currentOption.value !== option.value)
    )
  }

  const addQuantity = (option: SelectorOption<TValue>) => {
    const updated = selectedOptions.map(optionQuantity => {
      if (optionQuantity.option.value === option.value) {
        if (!optionQuantity.quantity) optionQuantity.quantity = 0
        optionQuantity.quantity += 1

        return optionQuantity
      }

      return optionQuantity
    })

    setSelectedOptions(updated)
  }

  const subQuantity = (option: SelectorOption<TValue>) => {
    const updated = selectedOptions.map(optionQuantity => {
      if (optionQuantity.option.value === option.value) {
        if (!optionQuantity.quantity) optionQuantity.quantity = 0
        optionQuantity.quantity -= 1

        return optionQuantity
      }

      return optionQuantity
    })

    setSelectedOptions(updated)
  }

  useEffect((): void => setSelectedOptions(selected), [selected])

  const removeType = (option: SelectorOption<TValue>) => {
    setSelectedOptions(
      selectedOptions.filter(optionQuantity => optionQuantity.option.value !== option.value),
    )
    setAvailableOptions(current => [...current, option])
  }

  return (
    <div className='position-relative'>
      <label className='form-label text-capitalize' htmlFor={id}>
        {label}
      </label>

      <Autocomplete
        autoSelect
        clearOnBlur
        freeSolo
        getOptionKey={option => {
          if (typeof (option) === 'string') return option

          return option.value
        }}
        getOptionLabel={option => {
          if (typeof (option) === 'string') return option

          return option.displayText
        }}
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
        {selectedOptions.map(optionQuantity => (
          <li
            className='list-group-item row d-flex justify-content-between'
            key={`selected-specie-${optionQuantity.option.value}`}
          >
            <div className='col-6'>{optionQuantity.option.displayText}</div>

            {withQuantity && (
              <div className='col-4'>
                <div className='d-flex justify-content-center align-items-center'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button p-1'
                    onClick={() => subQuantity(optionQuantity.option)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-xs'>remove</span>
                  </button>

                  <div className='text-center mx-3'>{optionQuantity.quantity}</div>

                  <button
                    className='btn btn-outline-dark btn-sm icon-button p-1'
                    onClick={() => addQuantity(optionQuantity.option)}
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
                onClick={() => removeType(optionQuantity.option)}
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
