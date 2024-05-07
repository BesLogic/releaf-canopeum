import './TreeSpeciesSelector.scss'

import OptionQuantitySelector, { type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import { LanguageContext } from '@components/context/LanguageContext'
import type { Sitetreespecies, TreeType } from '@services/api'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly species: Sitetreespecies[],
  readonly speciesOptions: TreeType[],
  readonly onChange: (selectedSpecies: Sitetreespecies[]) => void,
}

const TreeSpeciesSelector = ({ onChange, speciesOptions, species }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  // const [displaySearch, setDisplaySearch] = useState(false)
  // const [availableSpecies, setAvailableSpecies] = useState(speciesOptions)
  // const [filteredSpecies, setFilteredSpecies] = useState(speciesOptions)
  // const [selectedSpecies, setSelectedSpecies] = useState<Sitetreespecies[]>(species)
  const [options, setOptions] = useState(speciesOptions.map(speciesOption => ({
    value: speciesOption.id,
    displayText: translateValue(speciesOption),
  })))
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  // useEffect(() => setFilteredSpecies(availableSpecies), [availableSpecies, displaySearch])
  // useEffect(() => onChange(selectedSpecies), [selectedSpecies, onChange])
  // useEffect(() => setSelectedSpecies(species), [species])

  useEffect(() =>
    setSelected(species.map(specie => ({
      option: {
        displayText: translateValue(specie),
        value: specie.id,
      },
      quantity: specie.quantity,
    }))), [species, translateValue])

  const handleChange = (event: unknown) => console.log('ON CHANGEevent:', event)

  return (
    <OptionQuantitySelector
      label={translate('analytics.site-modal.site-tree-species')}
      onChange={handleChange}
      options={options}
      selected={selected}
    />
  )
}

export default TreeSpeciesSelector
