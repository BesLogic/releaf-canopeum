import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import type { TreeType } from '@services/api'
import { BatchSupportedSpecies } from '@services/api'
import { notEmpty } from '@utils/arrayUtils'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly species?: BatchSupportedSpecies[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedSpecies: BatchSupportedSpecies[]) => void,
}

const SupportSpeciesSelector = ({ onChange, species }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [availableSpecies, setAvailableSpecies] = useState<TreeType[]>([])
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  const fetchTreeSpecies = useCallback(
    async () => {
      const speciesResponse = await getApiClient().treeClient.species()
      setAvailableSpecies(speciesResponse)
      setOptions(speciesResponse.map(treeType => ({
        value: treeType.id,
        displayText: translateValue(treeType),
      })))
    },
    [getApiClient, translateValue],
  )

  useEffect(() => void fetchTreeSpecies(), [fetchTreeSpecies])

  useEffect(() => {
    if (!species) return

    setSelected(species.map(specie => ({
      option: {
        displayText: translateValue(specie),
        value: specie.id,
      },
    })))
  }, [species, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedSpecies = selectedOptions
      .map(optionQuantity => {
        const matchingSpecie = availableSpecies.find(specieOption =>
          specieOption.id === optionQuantity.option.value
        )
        if (!matchingSpecie) return null

        return new BatchSupportedSpecies({
          ...matchingSpecie,
        })
      })
      .filter(notEmpty)

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
