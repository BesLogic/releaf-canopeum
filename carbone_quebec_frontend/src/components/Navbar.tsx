import { Link, useLocation } from 'react-router-dom';


export default function Navbar() {

    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav d-flex align-items-end w-100 ms-3 gap-3 fs-4 text-primary fw-500">
                        <Link to="/map" className='pt-1 pb-1'>
                            <img className="navbar-logo" src="/Carbone_Quebec_Logo.png" alt="Logo" style={{ transition: 'all .5s' }} />
                        </Link>
                        <li className={`nav-item ${location.pathname === '/map' ? 'active' : ''}`}>
                            <Link className="nav-link d-flex flex-column" to="/map">
                                <span className="material-symbols-outlined">map</span>
                                <span className="fs-6">Carte</span>
                            </Link>
                        </li>
                        <li className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`}>
                            <Link className="nav-link d-flex flex-column" to="/projects">
                                <span className="material-symbols-outlined">park</span>
                                <span className="fs-6">Mes projets</span>
                            </Link>
                        </li>
                        <li className={`nav-item ${location.pathname === '/utilities' ? 'active' : ''}`}>
                            <Link className="nav-link d-flex flex-column" to="/utilities">
                                <span className="material-symbols-outlined">style</span>
                                <span className="fs-6">Utilities</span>
                            </Link>
                        </li>
                        <li className={`nav-item ms-auto ${location.pathname === '/user-management' ? 'active' : ''}`}>
                            <Link className="nav-link d-flex flex-column" to="/user-management">
                                <span className="material-symbols-outlined">account_circle</span>
                                <span className="fs-6">Mon compte</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
