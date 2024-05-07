import './OptionQuantitySelector.scss'

import { LanguageContext } from '@components/context/LanguageContext'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props<TValue> = {
  readonly selected: SelectorOptionQuantity<TValue>[],
  readonly options: SelectorOption<TValue>[],
  readonly label: string,
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
  { label, options, selected, onChange }: Props<TValue>,
) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const [displaySearch, setDisplaySearch] = useState(false)
  const [availableOptions, setAvailableOptions] = useState(options)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const [selectedOptions, setSelectedOptions] = useState(selected)

  useEffect(() => setFilteredOptions(availableOptions), [availableOptions, displaySearch])
  useEffect(() => {
    console.log('ON CHANGE USE EFFECT')
    onChange(selectedOptions)
  }, [selectedOptions])
  useEffect(() => setSelectedOptions(selected), [selected])

  const onSearchChange = (searchValue: string): void => {
    setFilteredOptions(
      availableOptions.filter(value =>
        value.displayText.toLowerCase().startsWith(searchValue.toLowerCase())
      ),
    )
  }

  const onSelect = (option: SelectorOption<TValue>) => {
    setSelectedOptions(current => [...current, { option, quantity: 0 }])
    setAvailableOptions(current =>
      current.filter(currentOption => currentOption.value !== option.value)
    )
    setDisplaySearch(false)
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

  const removeType = (option: SelectorOption<TValue>) => {
    setSelectedOptions(
      selectedOptions.filter(optionQuantity => optionQuantity.option.value !== option.value),
    )
    setAvailableOptions(current => [...current, option])
  }

  return (
    <div className='position-relative'>
      <label className='form-label text-capitalize' htmlFor='tree-type-search'>
        {label}
      </label>
      <input
        className='form-control tree-type-search'
        id='tree-type-search'
        onChange={event => onSearchChange(event.target.value)}
        onFocus={() => setDisplaySearch(true)}
        type='text'
      />

      <div className='position-relative'>
        {displaySearch &&
          (
            <div
              className='overflow-auto border position-absolute w-100 bg-white'
              style={{ maxHeight: '10rem', zIndex: 1 }}
            >
              <div className='list-group list-group-flush'>
                {filteredOptions.map(option => (
                  <button
                    className='list-group-item list-group-item-action'
                    key={`tree-type-${option.value}`}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      onSelect(option)
                    }}
                    type='button'
                  >
                    {option.displayText}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      <ul className='list-group list-group-flush overflow-hidden'>
        {selectedOptions.map(optionQuantity => (
          <li
            className='list-group-item row d-flex'
            key={`selected-specie-${optionQuantity.option.value}`}
          >
            <div className='col-6'>{optionQuantity.option.displayText}</div>

            <div className='col-4'>
              <div className='row align-items-center'>
                <div className='col'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button'
                    onClick={() => subQuantity(optionQuantity.option)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-sm'>remove</span>
                  </button>
                </div>

                <div className='col text-center'>{optionQuantity.quantity}</div>

                <div className='col'>
                  <button
                    className='btn btn-outline-dark btn-sm icon-button'
                    onClick={() => addQuantity(optionQuantity.option)}
                    type='button'
                  >
                    <span className='material-symbols-outlined fill-icon icon-sm'>add</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='col-2 d-flex justify-content-end'>
              <button
                className='btn btn-outline-dark btn-sm icon-button'
                onClick={() => removeType(optionQuantity.option)}
                type='button'
              >
                <span className='material-symbols-outlined fill-icon icon-sm'>clear</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OptionQuantitySelector
