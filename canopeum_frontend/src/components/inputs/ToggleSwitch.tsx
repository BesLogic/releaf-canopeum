type Props = {
  readonly text: string,
  readonly checked: boolean,
  readonly onChange: (checked: boolean) => void,
  readonly additionalClassNames?: string,
}

const ToggleSwitch = ({ text, checked, onChange, additionalClassNames }: Props) => (
  <div className={`form-check form-switch ${additionalClassNames ?? ''}`}>
    <input
      checked={checked}
      className={`form-check-input ${
        checked
          ? 'text-bg-primary'
          : ''
      }`}
      onChange={event =>
        onChange(event.target.checked)}
      role='switch'
      type='checkbox'
    />
    <label className='form-check-label'>{text}</label>
  </div>
)

export default ToggleSwitch
