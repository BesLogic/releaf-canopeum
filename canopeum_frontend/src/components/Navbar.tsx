import { Link } from 'react-router-dom';
import iconHome from "@assets/icons/home-regular.svg";
import iconAnalytics from "@assets/icons/analytics-regular.svg";
import iconMap from "@assets/icons/pin-map-regular.svg";
import iconUser from "@assets/icons/user-regular.svg";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-primary">
            <div className="container">
                <Link to="/home">
                    <img className="navbar-logo" src="/Releaf_Logo.svg" alt="Logo" style={{ transition: 'all .5s' }} />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/home">
                                <img src={iconHome} alt="iconHome"/>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/analytics">
                                <img src={iconAnalytics} alt="iconAnalytics" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/map">
                                <img src={iconMap} alt="iconMap" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/settings">
                                <img src={iconUser} alt="iconUser" />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/utilities">
                                Utilities
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
