import CustomIcon, { type IconSize } from '@components/icons/CustomIcon'
import type { CustomIconType } from '@components/icons/customIconList'

type Props = {
  readonly icon: CustomIconType,
  readonly iconSize?: IconSize,
  readonly count: number,
  readonly label: string,
}

const SiteCountBadge = ({ icon, iconSize, count, label }: Props) => (
  <div className='col-12 col-sm-6 col-xl-3 d-flex align-items-center gap-2'>
    <div className='
        bg-lightgreen
        rounded-circle
        d-flex
        justify-content-center
        align-items-center
        p-2
      '>
      <CustomIcon icon={icon} size={iconSize ?? '5xl'} />
    </div>

    <div className='d-flex flex-column'>
      <span className='text-primary fs-4 fw-bold'>{count}</span>
      <span className='text-muted'>{label}</span>
    </div>
  </div>
)

export default SiteCountBadge
