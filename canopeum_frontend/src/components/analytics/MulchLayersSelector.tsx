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

  const [availableMulchLayers, setAvailableMulchLayers] = useState<Map<number, MulchLayerType>>(
    new Map(),
  )
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  useEffect(() => {
    const fetchMulchLayers = async () => {
      const mulchLayerTypesResponse = await getApiClient().mulchLayerClient.allTypes()

      const mulchLayerMap = new Map<number, MulchLayerType>()
      const mulchLayerOptions = []
      for (const currentMulchLayer of mulchLayerTypesResponse) {
        mulchLayerMap.set(currentMulchLayer.id, currentMulchLayer)
        mulchLayerOptions.push({
          value: currentMulchLayer.id,
          displayText: translateValue(currentMulchLayer),
        })
      }

      setAvailableMulchLayers(mulchLayerMap)
      setOptions(mulchLayerOptions)
    }
    void fetchMulchLayers()
  }, [getApiClient, translateValue])

  useEffect(() =>
    mulchLayers
    && setSelected(
      mulchLayers.map(mulchLayer => {
        const matchingMulchLayer = availableMulchLayers.get(mulchLayer.id)
        if (!matchingMulchLayer) return null

        return {
          option: {
            displayText: translateValue(matchingMulchLayer),
            value: matchingMulchLayer.id,
          },
        }
      }).filter(notEmpty),
    ), [availableMulchLayers, mulchLayers, translateValue])

  const handleChange = useCallback((selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedMulchLayers = selectedOptions
      .map(optionQuantity => {
        const matchingMulchLayer = availableMulchLayers.get(optionQuantity.option.value)
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
