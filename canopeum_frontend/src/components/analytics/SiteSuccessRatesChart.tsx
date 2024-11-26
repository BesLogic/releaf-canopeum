import type { ChartsAxisContentProps } from '@mui/x-charts'
import { BarChart, type BarChartProps } from '@mui/x-charts/BarChart'
import { useTranslation } from 'react-i18next'

import type { SiteSummary } from '@services/api'

type SiteSummaryChartOptions = {
  groups: string[],
  series: BarChartProps['series'],
  colors: string[],
  average: number,
}

const buildChartOptions = (siteSummaries: SiteSummary[]) => {
  const options: SiteSummaryChartOptions = {
    groups: [],
    series: [],
    colors: [],
    average: 0,
  }
  if (siteSummaries.length === 0) return options

  options.average = siteSummaries.reduce(
    (accumulator, current) => accumulator + current.sponsorProgress,
    0,
  ) / siteSummaries.length

  let siteIndex = 0
  for (const site of siteSummaries) {
    // We can't color individual groups, only series.
    // To work around this limitation, we only add data for the serie
    // with the same index as the group, and set everything else to 0.
    // However, bars will appear really thin, so we use stacked bars to stack
    // 0-height bars on top of each other.
    const strackedSerie = Array.from<number>({ length: siteSummaries.length }).fill(0)
    strackedSerie[siteIndex] = site.sponsorProgress

    options.colors.push(
      site.sponsorProgress > options.average
        ? 'var(--bs-primary)'
        : 'var(--bs-secondary)',
    )
    options.series.push({ data: strackedSerie, stack: 'total', id: site.name })
    options.groups.push(String(site.name))

    siteIndex += 1
  }

  return options
}

type Props = {
  readonly siteSummaries: SiteSummary[],
}

const SiteSuccessRatesChart = ({ siteSummaries }: Props) => {
  const { t: translate } = useTranslation()

  const renderChartTooltip = (props: ChartsAxisContentProps) => {
    const selectedSerie = props.series.find(serie => serie.id === props.axisValue)
    // @typescript-eslint/no-unsafe-type-assertion -- value type is known from the context
    const data = selectedSerie?.data.find(value => !!value) as number | undefined

    return (
      <div className='p-2'>
        <div className='bg-body p-2 border rounded'>
          <h5 className='border-bottom'>{String(props.axisValue)}</h5>
          <div style={{ color: selectedSerie?.color }}>{data?.toFixed(1)} %</div>
        </div>
      </div>
    )
  }

  const renderSuccessRatesChart = () => {
    if (siteSummaries.length <= 0) return null

    const options = buildChartOptions(siteSummaries)

    return (
      <div>
        <h6>{translate('analytics.average')} : {options.average.toFixed(1)} %</h6>
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
                  label: translate('analytics.sufficient'),
                },
                {
                  id: 'insufficiant',
                  color: 'var(--bs-secondary)',
                  label: translate('analytics.insufficient'),
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

  return renderSuccessRatesChart()
}

export default SiteSuccessRatesChart
