import { isValidEmail } from '@utils/validators'
import { useState } from 'react'

type Props = {
  value: string | undefined,
  attributes?: React.InputHTMLAttributes<HTMLInputElement>,
  onChange: (value: string) => void,
}

const EmailTextField: React.FC<Props> = props => {
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    if (value && !isValidEmail(value)) {
      setError('Invalid email format (e.g. john.doe@contoso.com)')
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
        type='email'
        value={props.value}
      />
      {error && <span className='help-block text-danger'>{error}</span>}
    </>
  )
}

export default EmailTextField
