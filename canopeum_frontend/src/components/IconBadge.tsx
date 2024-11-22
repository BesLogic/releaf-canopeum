import type { MaterialIcon } from 'material-icons'

import type { SiteTypeIconKey } from '@models/SiteType'

type Props = {
  readonly iconKey: MaterialIcon | SiteTypeIconKey,
  readonly bgColor?: string,
}

const IconBadge = (props: Props) => {
  const bgColor = props.bgColor === ''
    ? ''
    : `text-bg-${props.bgColor ?? 'primary'}`

  return (
    <div
      className={`${bgColor} text-center rounded-circle`}
      style={{ height: '2em', width: '2em', minWidth: '2em' }}
    >
      <span
        className='material-symbols-outlined text-light align-middle'
        style={{ fontSize: 24, marginTop: '0.15em' }}
      >
        {props.iconKey}
      </span>
    </div>
  )
}

export default IconBadge
