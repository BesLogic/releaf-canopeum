import { type ChangeEvent, type KeyboardEvent, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

type Props = {
  readonly initialValue?: string,
  // Make sure to wrap the onChange function in a callback,
  // Otherwise it will trigger the useEffect everytime its component is re-rendered
  readonly onChange: (input: string) => void,
}

const DEFAULT_DEBOUNCE_TIME = 300

const SearchBar = ({ initialValue, onChange }: Props) => {
  const [searchValue, setSearchValue] = useState(initialValue ?? '')
  const [debouncedValue] = useDebounce(searchValue, DEFAULT_DEBOUNCE_TIME)

  useEffect(() => onChange(debouncedValue), [debouncedValue, onChange])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()
    setSearchValue(event.target.value)
  }

  const handleKey = (event: KeyboardEvent) => {
    event.stopPropagation()
    if (event.key !== 'Enter') return

    onChange(searchValue)
  }

  return (
    <div className='input-group'>
      <input
        className='form-control border-end-0 border rounded-start-pill'
        onChange={handleInputChange}
        onKeyDown={handleKey}
        type='text'
        value={searchValue}
      />
      <button
        className='
          input-group-append
          btn
          btn-outline-secondary
          border-start-0
          border
          rounded-end-pill
          d-flex
          align-items-center
        '
        onClick={() => onChange(searchValue)}
        type='button'
      >
        <span className='material-symbols-outlined fill-icon'>search</span>
      </button>
    </div>
  )
}

export default SearchBar
