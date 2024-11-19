/* eslint-disable max-lines -- disable max-lines */
import { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import BatchActions from '@components/analytics/BatchActions'
import BatchSponsorLogo from '@components/batches/BatchSponsorLogo'
import { LanguageContext } from '@components/context/LanguageContext'
import useApiClient from '@hooks/ApiClientHook'
import type { BatchDetail } from '@services/api'

const BATCH_HEADER_CLASS =
  'text-capitalize position-sticky start-0 table-primary border-1 border-top-0 border-primary'

type Props = {
  readonly batches: BatchDetail[],
  readonly siteId: number,
}

const cellBorderColor = 'var(--bs-gray-400)'

const BatchTable = (props: Props) => {
  const { t } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { getApiClient } = useApiClient()

  const [batches, setBatches] = useState(props.batches)

  const fetchBatch = useCallback(
    async (siteId: number) => {
      // TODO: Use endpoint to get specific batch directly instead of refetching site summary
      // Also only update required batch, not the entire array
      const siteSummary = await getApiClient().siteClient.summary(siteId)
      setBatches(siteSummary.batches)
    },
    [getApiClient],
  )

  useEffect(() => setBatches(props.batches), [props.batches])

  return (
    <div className='overflow-auto'>
      <table
        className='table w-100 mb-0'
        style={{ tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0 }}
      >
        <tbody>
          <tr>
            <th
              className='
                position-sticky
                start-0
                table-primary
                border-1
                border-primary
              '
              scope='row'
              style={{ width: '12.5rem' }}
            >
              <span className='text-capitalize'>{t('analytics.table-row-1')}</span>
            </th>
            {batches.map(batch => (
              <th
                className='table-primary border-1 border-start-0 border-primary'
                key={`batch-${batch.id}-name`}
                scope='col'
                style={{ width: '17.5rem' }}
              >
                <div className='d-flex justify-content-between align-items-center card-title'>
                  {batch.name}

                  <BatchActions
                    batchDetail={batch}
                    onDelete={() => setBatches(previous => previous.filter(b => b.id !== batch.id))}
                    onEdit={() => void fetchBatch(props.siteId)}
                  />
                </div>
              </th>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              <span className='text-capitalize'>{t('analytics.table-row-2')}</span>
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-sponsor`}
                style={{ borderColor: cellBorderColor }}
              >
                <BatchSponsorLogo sponsor={batch.sponsor} />
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-3')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-species`}
                style={{ borderColor: cellBorderColor }}
              >
                <ul>
                  {batch.species.map(batchSpecies => (
                    <li key={`batch-${batch.id}-batch-species-${batchSpecies.id}`}>
                      {translateValue(batchSpecies.treeType)} x {batchSpecies.quantity}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-4')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-size`}
                style={{ borderColor: cellBorderColor }}
              >
                {batch.size} ft²
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-5')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-soilCondition`}
                style={{ borderColor: cellBorderColor }}
              >
                {batch.soilCondition}
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-6')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-fertilizers`}
                style={{ borderColor: cellBorderColor }}
              >
                <ul>
                  {batch.fertilizers.map(type => (
                    <li key={`batch-${batch.id}-fertilizer-${type.en}`}>{translateValue(type)}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-7')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-mulchLayers`}
                style={{ borderColor: cellBorderColor }}
              >
                <ul>
                  {batch.mulchLayers.map(type => (
                    <li key={`batch-${batch.id}-mulchLayer-${type.en}`}>{translateValue(type)}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-8')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-supportedSpecies`}
                style={{ borderColor: cellBorderColor }}
              >
                <ul>
                  {batch.supportedSpecies.map(type => (
                    <li key={`batch-${batch.id}-supportedTreeType-${type.en}`}>
                      {translateValue(type)}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-9')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-plantCount`}
                style={{ borderColor: cellBorderColor }}
              >
                {batch.plantCount}
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-10')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-survivedCount`}
                style={{ borderColor: cellBorderColor }}
              >
                {batch.survivedCount}
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-11')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-replaceCount`}
                style={{ borderColor: cellBorderColor }}
              >
                {batch.replaceCount}
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-12')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-seedCollectedCount`}
                style={{ borderColor: cellBorderColor }}
              >
                {batch.totalNumberSeeds}
              </td>
            ))}
          </tr>
          <tr>
            <th
              className={BATCH_HEADER_CLASS}
              scope='row'
            >
              {t('analytics.table-row-13')}
            </th>
            {batches.map(batch => (
              <td
                className='border-top border-start border-1'
                key={`batch-${batch.id}-seeds`}
                style={{ borderColor: cellBorderColor }}
              >
                <ul>
                  {batch.seeds.map(batchSeed => (
                    <li key={`batch-${batch.id}-batch-seed-${batchSeed.id}`}>
                      {translateValue(batchSeed.treeType)} x {batchSeed.quantity}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default BatchTable
