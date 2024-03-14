import React from 'react';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/home">
                    <img className="navbar-logo" src="/logo.svg" alt="Logo" />
                </a>
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
                            <a className="nav-link" href="/home">
                                Home
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/analytics">
                                About
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/map">
                                Services
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/settings">
                                Settings
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
