import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import { Species, type TreeType } from '@services/api'
import { notEmpty } from '@utils/arrayUtils'

type Props = {
  readonly species?: Species[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedSpecies: Species[]) => void,
  readonly label: string,
}

const TreeSpeciesSelector = (
  { onChange, species, label }: Props,
) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [availableSpecies, setAvailableSpecies] = useState<Map<number, TreeType>>(new Map())
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  useEffect(() => {
    const fetchTreeSpecies = async () => {
      const speciesResponse = await getApiClient().treeClient.species()

      const speciesMap = new Map<number, TreeType>()
      const speciesOptions = []
      for (const currentSpecies of speciesResponse) {
        speciesMap.set(currentSpecies.id, currentSpecies)
        speciesOptions.push({
          value: currentSpecies.id,
          displayText: translateValue(currentSpecies),
        })
      }

      setAvailableSpecies(speciesMap)
      setOptions(speciesOptions)
    }
    void fetchTreeSpecies()
  }, [getApiClient, translateValue])

  useEffect(() =>
    species
    && setSelected(
      species.map(specie => {
        const matchingSpecie = availableSpecies.get(specie.id ?? -1)
        if (!matchingSpecie) return null

        return {
          option: {
            displayText: translateValue(matchingSpecie),
            value: matchingSpecie.id,
          },
          quantity: specie.quantity,
        }
      }).filter(notEmpty),
    ), [availableSpecies, species, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedSpecies = selectedOptions
      .map(optionQuantity => {
        const matchingSpecie = availableSpecies.get(optionQuantity.option.value)
        if (!matchingSpecie) return null

        return new Species({ ...matchingSpecie, quantity: optionQuantity.quantity ?? 0 })
      })
      .filter(notEmpty)

    onChange(selectedSpecies)
  }, [availableSpecies, onChange])

  return (
    <OptionQuantitySelector
      id='tree-type-quantity-selector'
      label={translate(label)}
      onChange={handleChange}
      options={options}
      selected={selected}
      withQuantity
    />
  )
}

export default TreeSpeciesSelector
