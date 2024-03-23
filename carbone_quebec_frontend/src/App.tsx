import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Projects from './pages/Projects';
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
                    <Route path="/" element={<Map />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/user-management" element={<UserManagement />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/utilities" element={<Utilities />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}
