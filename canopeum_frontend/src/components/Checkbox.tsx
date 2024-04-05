import { type ReactNode, useEffect, useState } from 'react'

type CheckboxValueType = string[] | number | string | undefined

type Props<TValue> = {
  readonly checked: boolean,
  readonly id: string,
  readonly value: TValue,
  readonly onChange: (value: TValue, selected: boolean) => void,
  readonly children?: ReactNode,
}

const Checkbox = <TValue extends CheckboxValueType,>({ checked, id, value, onChange, children }: Props<TValue>) => {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(
    () => setIsChecked(checked),
    [checked]
  )

  const handleChange = () => setIsChecked(previous => {
    const newValue = !previous
    onChange(value, newValue)

    return !previous
  })

  return (
    <div className='form-check'>
      <input
        checked={isChecked}
        className='form-check-input'
        id={id}
        onChange={handleChange}
        type='checkbox'
        value={value}
      />
      <label className='form-check-label' htmlFor={id}>
        {children}
      </label>
    </div>
  )
}

export default Checkbox
