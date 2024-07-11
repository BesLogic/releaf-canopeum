import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import type { MulchLayerType } from '@services/api'
import { BatchMulchLayer } from '@services/api'
import { notEmpty } from '@utils/arrayUtils'

type Props = {
  readonly mulchLayers?: MulchLayerType[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedMulchLayers: BatchMulchLayer[]) => void,
}

const MulchLayersSelector = ({ onChange, mulchLayers }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [availableMulchLayers, setAvailableMulchLayers] = useState<MulchLayerType[]>([])
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  const fetchMulchLayers = useCallback(
    async () => {
      const mulchLayerTypesResponse = await getApiClient().mulchLayerClient.allTypes()
      setAvailableMulchLayers(mulchLayerTypesResponse)
      setOptions(mulchLayerTypesResponse.map(mulchLayerType => ({
        value: mulchLayerType.id,
        displayText: translateValue(mulchLayerType),
      })))
    },
    [getApiClient, translateValue],
  )

  useEffect(() => void fetchMulchLayers(), [fetchMulchLayers])

  useEffect(() => {
    if (!mulchLayers) return

    setSelected(mulchLayers.map(mulchLayer => ({
      option: {
        displayText: translateValue(mulchLayer),
        value: mulchLayer.id,
      },
    })))
  }, [mulchLayers, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedMulchLayers = selectedOptions
      .map(optionQuantity => {
        const matchingMulchLayer = availableMulchLayers.find(mulchLayerOption =>
          mulchLayerOption.id === optionQuantity.option.value
        )
        if (!matchingMulchLayer) return null

        return new BatchMulchLayer({
          ...matchingMulchLayer,
        })
      })
      .filter(notEmpty)

    onChange(selectedMulchLayers)
  }, [availableMulchLayers, onChange])

  return (
    <OptionQuantitySelector
      id='mulch-layers-selector'
      label={translate('analyticsSite.batch-modal.mulch-layers-label')}
      onChange={handleChange}
      options={options}
      selected={selected}
    />
  )
}

export default MulchLayersSelector
