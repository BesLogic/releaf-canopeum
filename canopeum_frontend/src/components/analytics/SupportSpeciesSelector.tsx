import { isNonNullish } from '@beslogic/utils'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageContext } from '@components/context/LanguageContext'
import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/inputs/OptionQuantitySelector'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { TreeType } from '@services/api'

type Props = {
  readonly species?: TreeType[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedSpecies: TreeType[]) => void,
}

const SupportSpeciesSelector = ({ onChange, species }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

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
    fetchTreeSpecies().catch(displayUnhandledAPIError('errors.fetch-support-species-failed'))
  }, [])

  useEffect(() =>
    species
    && setSelected(
      species.map(specie => {
        const matchingSpecie = availableSpecies.get(specie.id)
        if (!matchingSpecie) return null

        return {
          option: {
            displayText: translateValue(matchingSpecie),
            value: matchingSpecie.id,
          },
        }
      }).filter(isNonNullish),
    ), [availableSpecies, species, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedSpecies = selectedOptions
      .map(optionQuantity => {
        const matchingSpecie = availableSpecies.get(optionQuantity.option.value)
        if (!matchingSpecie) return null

        return new TreeType({ ...matchingSpecie })
      })
      .filter(isNonNullish)

    onChange(selectedSpecies)
  }, [availableSpecies, onChange])

  return (
    <OptionQuantitySelector
      id='support-species-selector'
      label={translate('analyticsSite.batch-modal.support-species-label')}
      onChange={handleChange}
      options={options}
      selected={selected}
    />
  )
}

export default SupportSpeciesSelector
