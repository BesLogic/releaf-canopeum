import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Home from '../pages/Home'
import Analytics from '../pages/Analytics'
import MapSite from '../pages/MapSite'
import UserManagement from '../pages/UserManagement'
import Login from '../pages/Login'
import Utilities from '../pages/Utilities'
import Map from '../pages/Map'


const MainLayout: React.FC = () => {
  const location = useLocation();
  return <>
    {location.pathname !== '/login' && <Navbar />}
    <Routes>
      <Route element={<Home />} path="/home" />
      <Route element={<Home />} path="/" />
      <Route element={<Analytics />} path="/analytics" />
      <Route element={<Map />} path="/map" />
      <Route element={<MapSite />} path='/map/:siteId' />
      <Route element={<UserManagement />} path="/user-management" />
      <Route element={<Login />} path="/login" />
      <Route element={<Utilities />} path="/utilities" />
    </Routes></>
}

export default MainLayout
