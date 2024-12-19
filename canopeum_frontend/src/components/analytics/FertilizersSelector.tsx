import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import { LanguageContext } from '@components/context/LanguageContext'
import { SnackbarContext } from '@components/context/SnackbarContext'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { FertilizerType } from '@services/api'
import { notEmpty } from '@utils/arrayUtils'

type Props = {
  readonly fertilizers?: FertilizerType[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedFertilizers: FertilizerType[]) => void,
}

const FertilizersSelector = ({ onChange, fertilizers }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()
  const { openAlertSnackbar } = useContext(SnackbarContext)
  const { getErrorMessage } = useErrorHandling()

  const [availableFertilizers, setAvailableFertilizers] = useState<Map<number, FertilizerType>>(
    new Map(),
  )
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  useEffect(() => {
    const fetchFertilizers = async () => {
      const fertilizerTypesResponse = await getApiClient().fertilizerClient.allTypes()

      const fertilizerMap = new Map<number, FertilizerType>()
      const fertilizerOptions = []
      for (const currentFertilizer of fertilizerTypesResponse) {
        fertilizerMap.set(currentFertilizer.id, currentFertilizer)
        fertilizerOptions.push({
          value: currentFertilizer.id,
          displayText: translateValue(currentFertilizer),
        })
      }

      setAvailableFertilizers(fertilizerMap)
      setOptions(fertilizerOptions)
    }
    fetchFertilizers().catch((error: unknown) =>
      openAlertSnackbar(getErrorMessage(error, translate('errors.fetch-fertilizers-failed')),
      { severity: 'error' })
    )
  }, [])

  useEffect(() =>
    fertilizers
    && setSelected(
      fertilizers.map(fertilizer => {
        const matchingFertilizer = availableFertilizers.get(fertilizer.id)
        if (!matchingFertilizer) return null

        return {
          option: {
            displayText: translateValue(matchingFertilizer),
            value: matchingFertilizer.id,
          },
        }
      }).filter(notEmpty),
    ), [availableFertilizers, fertilizers, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedFertilizers = selectedOptions
      .map(optionQuantity => {
        const matchingFertilizer = availableFertilizers.get(optionQuantity.option.value)
        if (!matchingFertilizer) return null

        return new FertilizerType({
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
