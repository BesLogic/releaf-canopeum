import type { MaterialIcon } from 'material-icons'

type Props = {
  readonly type: MaterialIcon,
}

const PrimaryIconBadge = (props: Props) => (
  <div
    className='text-bg-primary text-center rounded-circle'
    style={{ height: '2em', width: '2em' }}
  >
    <span
      className='material-symbols-outlined align-middle'
      style={{ fontSize: 24, marginTop: '0.15em' }}
    >
      {props.type}
    </span>
  </div>
)

export default PrimaryIconBadge
