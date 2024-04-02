const SearchBar = () => (
  <div className='input-group'>
    <input
      className='form-control border-end-0 border rounded-start-pill'
      type='text'
    />
    <span className='input-group-append'>
      <button
        className='btn btn-outline-secondary bg-white border-start-0 border rounded-end-pill d-flex align-items-center'
        type='button'
      >
        <span className='material-symbols-outlined fill-icon'>search</span>
      </button>
    </span>
  </div>
)

export default SearchBar
