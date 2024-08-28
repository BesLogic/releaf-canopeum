import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import OptionQuantitySelector, { type SelectorOption, type SelectorOptionQuantity } from '@components/analytics/OptionQuantitySelector'
import type { TreeTypeDto } from '@components/analytics/site-modal/SiteModal'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import type { TreeType } from '@services/api'
import { notEmpty } from '@utils/arrayUtils'

type Props = {
  readonly species?: TreeTypeDto[],
  // Make sure that onChange is included in a useCallback if part of a component
  readonly onChange: (selectedSpecies: TreeTypeDto[]) => void,
  readonly label: string,
}

const TreeSpeciesSelector = (
  { onChange, species, label }: Props,
) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [availableSpecies, setAvailableSpecies] = useState<TreeType[]>([])
  const [options, setOptions] = useState<SelectorOption<number>[]>([])
  const [selected, setSelected] = useState<SelectorOptionQuantity<number>[]>([])

  useEffect(() => {
    const fetchTreeSpecies = async () => {
      const speciesResponse = await getApiClient().treeClient.species()
      setAvailableSpecies(speciesResponse)
      setOptions(speciesResponse.map(treeType => ({
        value: treeType.id,
        displayText: translateValue(treeType),
      })))
    }
    void fetchTreeSpecies()
  }, [getApiClient, translateValue])

  useEffect(() =>
    species &&
    setSelected(species.map(specie => {
      const matchingSpecie = availableSpecies.find(specieOption => specieOption.id === specie.id)

      return {
        option: {
          displayText: matchingSpecie
            ? translateValue(matchingSpecie)
            : '',
          value: specie.id,
        },
        quantity: specie.quantity,
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- onChange is a dependency
    })), [availableSpecies])

  const handleChange = (selectedOptions: SelectorOptionQuantity<number>[]) => {
    const selectedSpecies = selectedOptions
      .map(optionQuantity => {
        const matchingSpecie = availableSpecies.find(specieOption =>
          specieOption.id === optionQuantity.option.value
        )
        if (!matchingSpecie) return null

        return {
          ...matchingSpecie,
          quantity: optionQuantity.quantity ?? 0,
        } as TreeTypeDto
      })
      .filter(notEmpty)

    if (selectedSpecies === species) return

    onChange(selectedSpecies)
  }

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
