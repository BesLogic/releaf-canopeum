import type { JSX } from 'react'

import siteTypeCanopeum from '@assets/icons/site-type-canopeum.svg?raw'
import siteTypeFarmLand from '@assets/icons/site-type-farm-land.svg?raw'

const iconMapping: Record<number, JSX.Element> = {
  // eslint-disable-next-line react/no-danger -- loading our own svg
  1: <i dangerouslySetInnerHTML={{ __html: siteTypeCanopeum }} />,
  2: (
    <span className='material-symbols-outlined align-middle'>
      forest
    </span>
  ),
  3: (
    <span className='material-symbols-outlined align-middle'>
      workspaces
    </span>
  ),
  4: (
    <span className='material-symbols-outlined align-middle'>
      school
    </span>
  ),
  // eslint-disable-next-line react/no-danger -- loading our own svg
  5: <i dangerouslySetInnerHTML={{ __html: siteTypeFarmLand }} />,
  6: (
    <span className='material-symbols-outlined align-middle'>
      source_environment
    </span>
  ),
}

type Props = { siteTypeId: number }

const SiteTypeIcon = ({ siteTypeId }: Props) => iconMapping[siteTypeId]
export default SiteTypeIcon
