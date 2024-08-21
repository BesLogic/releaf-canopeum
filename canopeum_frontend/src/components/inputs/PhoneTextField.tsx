import { isValidPhone } from '@utils/validators'
import { useState } from 'react'

type Props = {
  value: string | undefined,
  attributes?: React.InputHTMLAttributes<HTMLInputElement>,
  onChange: (value: string) => void,
}

const PhoneTextField: React.FC<Props> = props => {
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    if (value && !isValidPhone(value)) {
      setError('Invalid phone number format (e.g. +1234567890)')
    } else {
      setError(null)
    }

    props.onChange(value)
  }

  return (
    <>
      <input
        {...props.attributes}
        onChange={event => handleChange(event.target.value)}
        type='tel'
        value={props.value}
      />
      {error && <span className='help-block text-danger'>{error}</span>}
    </>
  )
}

export default PhoneTextField
