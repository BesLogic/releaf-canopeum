import { isValidUrl } from '@utils/validators'
import React, { useState } from 'react'

type Props = {
  value: string | undefined,
  attributes?: React.InputHTMLAttributes<HTMLInputElement>,
  onChange: (value: string) => void,
}

const UrlTextField: React.FC<Props> = props => {
  const [error, setError] = useState<string | null>(null)

  const handleChange = (value: string) => {
    if (value && !isValidUrl(value)) {
      setError('Invalid URL format (e.g. https://example.com)')
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
        type='url'
        value={props.value}
      />
      {error && <span className='help-block text-danger'>{error}</span>}
    </>
  )
}

export default UrlTextField
