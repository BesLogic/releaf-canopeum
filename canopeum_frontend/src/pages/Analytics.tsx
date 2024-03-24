/* eslint-disable jsx-a11y/prefer-tag-over-role -- required for bs style of progress */
import type { ChartsAxisContentProps } from '@mui/x-charts'
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SiteSummary } from '../services/api'
import api from '../services/apiInterface'
import { ensureError } from '../services/errors'

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
  const [siteSummaries, setSiteSummaries] = useState<SiteSummary[]>([])
  const [isLoadingSiteSummaries, setIsLoadingSiteSummaries] = useState(false)
  const [siteSummariesError, setSiteSummariesError] = useState<Error | undefined>(undefined)

  const fetchSites = async () => {
    setIsLoadingSiteSummaries(true)
    try {
      const response = await api().analytics.siteSummaries()
      setSiteSummaries(response)
    } catch (error: unknown) {
      setSiteSummariesError(ensureError(error))
    } finally {
      setIsLoadingSiteSummaries(false)
    }
  }

  useEffect((): void => {
    void fetchSites()
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
        <h5 className='text-capitalize'>{t('analytics.average')} : {options.average.toFixed(1)} %</h5>
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

  const renderSiteCards = () => {
    if (isLoadingSiteSummaries) {
      return <p>Loading...</p>
    }

    if (siteSummariesError) {
      return <p>Error: {siteSummariesError.message}</p>
    }

    return siteSummaries.map(site => (
      <div
        className='col-3'
        key={site.name}
      >
        <div className='card h-100 py-3'>
          <div className='card-body d-flex flex-column h-100'>
            <div className='d-flex align-items-center card-title'>
              <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-1 me-2'>
                <span className='material-symbols-outlined text-light'>school</span>
              </div>
              <h5 className='mb-0'>{site.name ?? 'Unnamed site'}</h5>
            </div>

            <div className='card-subtitle my-1'>
              <div className='d-flex align-items-center text-muted'>
                <span className='material-symbols-outlined fill-icon text-muted me-1'>location_on</span>
                <span>Missing Location</span>
              </div>
              <div className='d-flex align-items-center text-muted'>
                <span className='material-symbols-outlined fill-icon text-muted me-1'>person</span>
                <span>Missing Owner</span>
              </div>
            </div>

            <div className='card-text mt-2'>
              <div className='row my-2'>
                <div className='col-4 d-flex flex-column align-items-center'>
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>psychiatry</span>
                  </div>
                  <span>{site.plantCount}</span>
                  <span className='text-muted'>Planted</span>
                </div>

                <div className='col-4 d-flex flex-column align-items-center'>
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>forest</span>
                  </div>
                  <span>{site.survivedCount}</span>
                  <span className='text-muted'>Survived</span>
                </div>

                <div className='col-4 d-flex flex-column align-items-center'>
                  <div className='bg-primary rounded-circle d-flex justify-content-center align-items-center p-2'>
                    <span className='material-symbols-outlined text-light'>forest</span>
                  </div>
                  <span>{site.propagationCount}</span>
                  <span className='text-muted'>Propagation</span>
                </div>
              </div>

              <div className='mt-4 d-flex align-items-center'>
                <div className='flex-grow-1 progress'>
                  <div
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={site.progress}
                    className='progress-bar'
                    role='progressbar'
                    style={{ width: `${site.progress}%` }}
                  />
                </div>

                <span className='text-primary ms-2'>{Math.round(site.progress)}% Sponsored</span>
              </div>
            </div>
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

        <div className='mt-2 row gx-3 gy-3 pb-3 overflow-auto' style={{ maxHeight: '62rem' }}>
          {renderSiteCards()}
        </div>

        <div className='mt-4 bg-white rounded p-3'>
          <h2>Average Annual Success Rate Per Site</h2>
          {renderSuccessRatesChart(siteSummaries)}
        </div>

        <div className='mt-4 bg-white rounded p-3'>
          <div className='d-flex justify-content-between'>
            <h2>Batch Tracking</h2>
            <div>
              <span>Filters Go Here</span>
            </div>
          </div>
          {renderSuccessRatesChart(siteSummaries)}
        </div>
      </div>
    </div>
  )
}

export default Analytics
