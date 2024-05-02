import './TreeSpeciesSelector.scss'

import { LanguageContext } from '@components/context/LanguageContext'
import type { TreeType } from '@services/api'
import { Sitetreespecies } from '@services/api'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly species: Sitetreespecies[],
  readonly speciesOptions: TreeType[],
  readonly searchBarLabel?: string,
  readonly onChange: (selectedSpecies: Sitetreespecies[]) => void,
}

const TreeSpeciesSelector = ({ onChange, searchBarLabel, speciesOptions, species }: Props) => {
  const { t } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const [displaySearch, setDisplaySearch] = useState(false)
  const [availableSpecies, setAvailableSpecies] = useState(speciesOptions)
  const [filteredSpecies, setFilteredSpecies] = useState(speciesOptions)
  const [selectedSpecies, setSelectedSpecies] = useState<Sitetreespecies[]>(species)

  useEffect(() => setFilteredSpecies(availableSpecies), [displaySearch])
  useEffect(() => onChange(selectedSpecies), [selectedSpecies])
  useEffect(() => setSelectedSpecies(species), [species])

  const onSearchChange = (searchValue: string): void => {
    setFilteredSpecies(
      availableSpecies.filter(value =>
        translateValue(value).toLowerCase().startsWith(searchValue.toLowerCase())
      ),
    )
  }

  const onSelect = (treeType: TreeType) => {
    setSelectedSpecies(current => [...current, new Sitetreespecies({ ...treeType, quantity: 0 })])
    setAvailableSpecies(current => current.filter(value => value.id !== treeType.id))
    setDisplaySearch(false)
  }

  const addQuantity = (treeType: TreeType) => {
    const updated = selectedSpecies.map(value => {
      if (value.id === treeType.id) {
        if (!value.quantity) value.quantity = 0
        value.quantity += 1

        return value
      }

      return value
    })

    setSelectedSpecies(updated)
  }

  const subQuantity = (treeType: TreeType) => {
    const updated = selectedSpecies.map(value => {
      if (value.id === treeType.id) {
        if (!value.quantity) value.quantity = 0
        value.quantity -= 1

        return value
      }

      return value
    })

    setSelectedSpecies(updated)
  }

  const removeType = (treeType: TreeType) => {
    setSelectedSpecies(selectedSpecies.filter(value => value.id !== treeType.id))
    setAvailableSpecies(current => [...current, treeType])
  }

  return (
    <div className='position-relative'>
      {searchBarLabel &&
        (
          <label className='form-label text-capitalize' htmlFor='tree-type-search'>
            {t(searchBarLabel)}
          </label>
        )}
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
                {filteredSpecies.map(value => (
                  <button
                    className='list-group-item list-group-item-action'
                    key={`tree-type-${value.id}`}
                    onClick={event => {
                      event.preventDefault()
                      event.stopPropagation()
                      onSelect(value)
                    }}
                    type='button'
                  >
                    {translateValue(value)}
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      <ul className='list-group list-group-flush overflow-hidden'>
        {selectedSpecies.map(value => (
          <li className='list-group-item row d-flex' key={`selected-specie-${value.id}`}>
            <div className='col-7'>{translateValue(value)}</div>
            <div className='col-4'>
              <div className='row'>
                <div className='col'>
                  <button
                    className='btn btn-outline-dark btn-sm'
                    onClick={() =>
                      subQuantity(value)}
                    type='button'
                  >
                    -
                  </button>
                </div>
                <div className='col text-center'>{value.quantity}</div>
                <div className='col'>
                  <button
                    className='btn btn-outline-dark btn-sm'
                    onClick={() =>
                      addQuantity(value)}
                    type='button'
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className='col-1'>
              <button
                className='btn btn-outline-dark btn-sm'
                onClick={() => removeType(value)}
                type='button'
              >
                X
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TreeSpeciesSelector
