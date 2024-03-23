import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav className='navbar navbar-expand-lg bg-primary'>
    <div className='container'>
      <Link to='/home'>
        <img alt='Logo' className='navbar-logo' src='/Releaf_Logo.svg' style={{ transition: 'all .5s' }} />
      </Link>
      <button
        aria-controls='navbarNav'
        aria-expanded='false'
        aria-label='Toggle navigation'
        className='navbar-toggler'
        data-target='#navbarNav'
        data-toggle='collapse'
        type='button'
      >
        <span className='navbar-toggler-icon' />
      </button>
      <div className='collapse navbar-collapse' id='navbarNav'>
        <ul className='navbar-nav d-flex w-100 ms-3 gap-3 fs-4'>
          <li className='nav-item'>
            <Link className='nav-link' to='/home'>
              <span className='material-symbols-outlined text-light'>home</span>
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/analytics'>
              <span className='material-symbols-outlined text-light'>donut_small</span>
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/map'>
              <span className='material-symbols-outlined text-light'>pin_drop</span>
            </Link>
          </li>
          <li className='nav-item'>
            <Link className='nav-link' to='/utilities'>
              <span className='material-symbols-outlined text-light'>style</span>
            </Link>
          </li>
          <li className='nav-item ms-auto'>
            <Link className='nav-link' to='/settings'>
              <span className='material-symbols-outlined text-light'>account_circle</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
)
export default Navbar
