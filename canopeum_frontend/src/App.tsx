import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Map from './pages/Map';
import UserManagement from './pages/UserManagement';
import Login from './pages/Login';

import Navbar from './components/Navbar';
import Utilities from './pages/Utilities';

import 'bootstrap/js/index.umd.js';

export default function App() {
    return (
        <>
            <BrowserRouter>
            <Navbar />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/utilities" element={<Utilities />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
