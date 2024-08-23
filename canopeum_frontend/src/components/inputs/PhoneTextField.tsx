import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { isValidPhone } from '@utils/validators'

type Props = {
  value: string | undefined,
  attributes?: React.InputHTMLAttributes<HTMLInputElement>,
  onChange: (value: string) => void,
  isValid: (valid: boolean) => void,
}

const PhoneTextField: React.FC<Props> = props => {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    if (value && !isValidPhone(value)) {
      setError(t('errors.phone-invalid'))
      props.isValid(false)
    } else {
      setError(null)
      props.isValid(true)
    }

    props.onChange(value)
  }

  return (
    <div className='d-flex flex-column flex-grow-1'>
      <input
        {...props.attributes}
        onChange={event => handleChange(event.target.value)}
        type='tel'
        value={props.value}
      />
      {error && <span className='help-block text-danger'>{error}</span>}
    </div>
  )
}

export default PhoneTextField
