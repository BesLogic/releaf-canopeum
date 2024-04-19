type Props = {
  readonly type:
  | 'account_circle'
  | 'add_a_photo'
  | 'add'
  | 'cancel'
  | 'donut_small'
  | 'eco'
  | 'edit_square'
  | 'forest'
  | 'home_work'
  | 'home'
  | 'location_on'
  | 'mail'
  | 'mood'
  | 'perm_phone_msg'
  | 'person'
  | 'pin_drop'
  | 'psychiatry'
  | 'school'
  | 'smart_display'
  | 'sms'
  | 'source_environment'
  | 'workspaces',
}

const PrimaryIconBadge = (props: Props) => (
  <div
    className='text-bg-primary text-center rounded-circle'
    style={{ height: '2em', width: '2em' }}
  >
    <span
      className='material-symbols-outlined text-light align-middle'
      style={{ fontSize: 24, marginTop: '0.15em' }}
    >
      {props.type}
    </span>
  </div>
)

export default PrimaryIconBadge
