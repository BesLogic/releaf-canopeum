import CustomIcon, { type IconSize } from '@components/icons/CustomIcon'
import type { CustomIconType } from '@components/icons/customIconList'

type Props = {
  readonly icon: CustomIconType,
  readonly size?: IconSize,
}

const CustomIconBadge = ({ icon, size }: Props) => (
  <div
    className='d-flex align-items-center justify-content-center text-bg-primary rounded-circle'
    style={{ height: '2em', width: '2em' }}
  >
    <CustomIcon icon={icon} size={size} />
  </div>
)

export default CustomIconBadge
