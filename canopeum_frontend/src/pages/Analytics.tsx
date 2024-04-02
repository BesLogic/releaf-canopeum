import BatchTable from '@components/analytics/BatchTable'
import SiteSummaryCard from '@components/analytics/SiteSummaryCard'
import { LanguageContext } from '@components/context/LanguageContext'
import type { ChartsAxisContentProps } from '@mui/x-charts'
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { BatchAnalytics, SiteSummary } from '../services/api'
import api from '../services/apiInterface'

type SiteSummaryChartOptions = { groups: string[], series: BarChartProps['series'], colors: string[], average: number }

const buildChartOptions = (siteSummaries: SiteSummary[]) => {
  // eslint-disable-next-line total-functions/no-partial-division -- length checked above
  const average = siteSummaries.reduce(
    (accumulator, current) => accumulator + current.progress,
    0,
  ) / siteSummaries.length

  const options: SiteSummaryChartOptions = {
    groups: [],
    series: [],
    colors: [],
    average,
  }
  let siteIndex = 0
  for (const site of siteSummaries) {
    // We can't color individual groups, only series.
    // To work around this limitation, we only add data for the serie
    // with the same index as the group, and set everything else to 0.
    // However, bars will appear really thin, so we use stacked bars to stack
    // 0-height bars on top of each other.
    const strackedSerie = Array.from<number>({ length: siteSummaries.length }).fill(0)
    strackedSerie[siteIndex] = site.progress

    options.colors.push(
      site.progress > average
        ? 'var(--bs-primary)'
        : 'var(--bs-secondary)',
    )
    options.series.push({ data: strackedSerie, stack: 'total', id: site.name })
    options.groups.push(String(site.name))

    siteIndex += 1
  }

  return options
}

const Analytics = () => {
  const { t } = useTranslation()
  const { formatDate } = useContext(LanguageContext)
  const [siteSummaries, setSiteSummaries] = useState<SiteSummary[]>([])
  const [batches, setBatches] = useState<BatchAnalytics[]>([])

  const fetchSites = async () => setSiteSummaries(await api().analytics.siteSummaries())

  const fetchBatches = async () => setBatches(await api().analytics.batches())

  useEffect((): void => {
    void fetchSites()
    void fetchBatches()
  }, [])

  const renderChartTooltip = (props: ChartsAxisContentProps) => {
    const selectedSerie = props.series.find(serie => serie.id === props.axisValue)
    // eslint-disable-next-line total-functions/no-unsafe-type-assertion -- value type is known from the context
    const data = selectedSerie?.data.find(value => !!value) as number | undefined

    return (
      <div className='p-2'>
        <div className='bg-body p-2 border rounded'>
          <h5 className='border-bottom'>{props.axisValue}</h5>
          <div style={{ color: selectedSerie?.color }}>{data?.toFixed(1)} %</div>
        </div>
      </div>
    )
  }

  const renderSuccessRatesChart = (summaries: SiteSummary[]) => {
    if (summaries.length <= 0) return null

    const options = buildChartOptions(summaries)

    return (
      <div>
        <h6 className='text-capitalize'>{t('analytics.average')} : {options.average.toFixed(1)} %</h6>
        <BarChart
          colors={options.colors}
          grid={{ horizontal: true, vertical: true }}
          height={400}
          series={options.series}
          slotProps={{
            legend: {
              position: { vertical: 'top', horizontal: 'right' },
              padding: { top: -30, right: 30, bottom: 10, left: 10 },
              itemGap: 100,
              labelStyle: { textTransform: 'capitalize' },
              seriesToDisplay: [
                {
                  id: 'sufficient',
                  color: 'var(--bs-primary)',
                  label: t('analytics.sufficient'),
                },
                {
                  id: 'insufficiant',
                  color: 'var(--bs-secondary)',
                  label: t('analytics.insufficient'),
                },
              ],
            },
          }}
          slots={{
            axisContent: props => renderChartTooltip(props),
          }}
          xAxis={[{
            scaleType: 'band',
            data: options.groups,
            tickLabelStyle: {
              width: 1, // Make all text render, even if the chart thinks it'll overapp
              // arbitrary rotation to ensure text doesn't visually overlap
              angle: 15,
              dominantBaseline: 'hanging',
              textAnchor: 'start',
              translate: '-3%',
            },
          }]}
        />
      </div>
    )
  }

  const renderBatches = () => {
    const mappedBatchesPerSite = new Map<number, BatchAnalytics[]>()
    for (const batch of batches) {
      mappedBatchesPerSite.set(batch.siteId, [...mappedBatchesPerSite.get(batch.siteId) ?? [], batch])
    }

    return siteSummaries.map(site => (
      <div className='accordion-item mb-3 rounded' key={site.id}>
        <h2 className='accordion-header rounded' id={`heading-${site.id}`}>
          <button
            aria-controls={`collapse-${site.id}`}
            aria-expanded='true'
            className='accordion-button collapsed rounded'
            data-bs-target={`#collapse-${site.id}`}
            data-bs-toggle='collapse'
            type='button'
          >
            <div className='d-flex justify-content-between w-100 pe-3 fs-5'>
              <span>{site.name}</span>
              <span className='text-capitalize' style={{ opacity: .5 }}>
                {t('analytics.last-update')}: {formatDate(new Date())}
              </span>
              <span className='text-capitalize'>
                {mappedBatchesPerSite.get(site.id)?.length ?? 0} {t('analytics.batches')}
              </span>
            </div>
          </button>
        </h2>
        <div
          aria-labelledby={`heading-${site.id}`}
          className='accordion-collapse collapse'
          data-bs-parent='#accordion-batches'
          id={`collapse-${site.id}`}
        >
          <div className='accordion-body'>
            <BatchTable batches={batches} />
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div>
      <div className='container d-flex flex-column gap-2' style={{ padding: '1rem 10rem' }}>
        <div className='d-flex justify-content-between'>
          <h1 className='text-light'>Manage my Sites</h1>

          <button className='btn btn-secondary' type='button'>Create a New Site</button>
        </div>

        <div className='mt-2 row gx-3 gy-3 pb-3' style={{ maxHeight: '62rem' }}>
          {siteSummaries.map(site => <SiteSummaryCard key={`site-${site.id}-card`} site={site} />)}
        </div>

        <div className='mt-4 bg-white rounded p-3'>
          <h5>Average Annual Success Rate Per Site</h5>
          {renderSuccessRatesChart(siteSummaries)}
        </div>

        <div className='mt-4'>
          <div className='bg-white rounded p-3 px-4'>
            <div className='d-flex justify-content-between'>
              <div className='fs-5'>Batch Tracking</div>
              <div>
                <span>Filters Go Here</span>
              </div>
            </div>
          </div>
          <div className='accordion mt-4' id='accordion-batches'>
            {renderBatches()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
