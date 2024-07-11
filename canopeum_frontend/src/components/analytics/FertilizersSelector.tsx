import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import { Batchfertilizer, type FertilizerType } from '@services/api'
import { notEmpty } from '@utils/arrayUtils'

type Props = {
  readonly fertilizers?: FertilizerType[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedFertilizers: Batchfertilizer[]) => void,
}

const FertilizersSelector = ({ onChange, fertilizers }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [availableFertilizers, setAvailableFertilizers] = useState<FertilizerType[]>([])
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  const fetchFertilizers = useCallback(
    async () => {
      const fertilizerTypesResponse = await getApiClient().fertilizerClient.allTypes()
      setAvailableFertilizers(fertilizerTypesResponse)
      setOptions(fertilizerTypesResponse.map(fertilizerType => ({
        value: fertilizerType.id,
        displayText: translateValue(fertilizerType),
      })))
    },
    [getApiClient, translateValue],
  )

  useEffect(() => void fetchFertilizers(), [fetchFertilizers])

  useEffect(() => {
    if (!fertilizers) return

    setSelected(fertilizers.map(fertilizer => ({
      option: {
        displayText: translateValue(fertilizer),
        value: fertilizer.id,
      },
    })))
  }, [fertilizers, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedFertilizers = selectedOptions
      .map(optionQuantity => {
        const matchingFertilizer = availableFertilizers.find(fertilizerOption =>
          fertilizerOption.id === optionQuantity.option.value
        )
        if (!matchingFertilizer) return null

        return new Batchfertilizer({
          ...matchingFertilizer,
        })
      })
      .filter(notEmpty)

    onChange(selectedFertilizers)
  }, [availableFertilizers, onChange])

  return (
    <OptionQuantitySelector
      id='fertilizers-selector'
      label={translate('analyticsSite.batch-modal.fertilizers-label')}
      onChange={handleChange}
      options={options}
      selected={selected}
    />
  )
}

export default FertilizersSelector
