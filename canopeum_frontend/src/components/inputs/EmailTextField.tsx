import { type FC, type InputHTMLAttributes, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { isValidEmail } from '@utils/validators'

type Props = {
  readonly value: string | undefined,
  readonly attributes?: InputHTMLAttributes<HTMLInputElement>,
  readonly onChange: (value: string) => void,
  readonly isValid: (valid: boolean) => void,
}

const EmailTextField: FC<Props> = props => {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    if (value && !isValidEmail(value)) {
      setError(t('errors.email-invalid'))
      props.isValid(false)
    } else {
      setError(null)
      props.isValid(true)
    }

    props.onChange(value)
  }

  return (
    <div className='d-flex flex-column flex-grow-1'>
      {/* eslint-disable react/jsx-props-no-spreading -- Needed for custom input */}
      <input
        {...props.attributes}
        onChange={event => handleChange(event.target.value)}
        type='email'
        value={props.value}
      />
      {/* eslint-enable react/jsx-props-no-spreading */}
      {error && <span className='help-block text-danger'>{error}</span>}
    </div>
  )
}

export default EmailTextField
