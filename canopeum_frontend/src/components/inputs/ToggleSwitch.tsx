type Props = {
  readonly text: string,
  readonly checked: boolean,
  readonly onChange: (checked: boolean) => void,
  readonly additionalClassNames?: string,
  readonly id: string,
}

const ToggleSwitch = ({ text, checked, id, onChange, additionalClassNames }: Props) => (
  <div className={`form-check mb-0 form-switch ${additionalClassNames ?? ''}`}>
    <input
      checked={checked}
      className={`form-check-input ${
        checked
          ? 'text-bg-primary'
          : ''
      }`}
      id={id}
      onChange={event =>
        onChange(event.target.checked)}
      role='switch'
      type='checkbox'
    />
    <label className='form-check-label' htmlFor={id}>{text}</label>
  </div>
)

export default ToggleSwitch
