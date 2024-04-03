import { type ChangeEvent, type KeyboardEvent, useState } from 'react'

type Props = {
  readonly initialValue?: string,
  readonly onChange: (input: string) => void,
}

const SearchBar = ({ initialValue, onChange }: Props) => {
  const [searchValue, setSearchValue] = useState(initialValue ?? '')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return

    onChange(searchValue)
  }

  return (
    <div className='input-group'>
      <input
        className='form-control border-end-0 border rounded-start-pill'
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        type='text'
        value={searchValue}
      />
      <span className='input-group-append'>
        <button
          className='
            btn btn-outline-secondary bg-white border-start-0 border rounded-end-pill d-flex align-items-center'
          onClick={() => onChange(searchValue)}
          type='button'
        >
          <span className='material-symbols-outlined fill-icon'>search</span>
        </button>
      </span>
    </div>
  )
}

export default SearchBar
