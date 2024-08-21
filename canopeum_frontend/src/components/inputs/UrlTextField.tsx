import { isValidUrl } from '@utils/validators'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  value: string | undefined,
  attributes?: React.InputHTMLAttributes<HTMLInputElement>,
  onChange: (value: string) => void,
  isValid: (valid: boolean) => void,
}

const UrlTextField: React.FC<Props> = props => {
  const { t } = useTranslation()
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    if (value && !isValidUrl(value)) {
      setError(t('errors.url-invalid'))
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
        type='url'
        value={props.value}
      />
      {error && <span className='help-block text-danger'>{error}</span>}
    </div>
  )
}

export default UrlTextField
