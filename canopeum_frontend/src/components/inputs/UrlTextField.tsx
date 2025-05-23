import { type InputHTMLAttributes, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { isValidUrl } from '@utils/validators'

type Props = {
  readonly value: string | undefined,
  readonly attributes?: InputHTMLAttributes<HTMLInputElement>,
  readonly onChange: (value: string) => void,
  readonly isValid: (valid: boolean) => void,
}

const UrlTextField = (props: Props) => {
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
        className='form-control'
        onChange={event => handleChange(event.target.value)}
        type='url'
        value={props.value}
      />
      {error && <span className='help-block text-danger'>{error}</span>}
    </div>
  )
}

export default UrlTextField
