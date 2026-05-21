import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import AccountSetup from './components/AccountSetup'
import Homepage from './components/Homepage'
import Cart from './components/Cart'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account-setup" element={<AccountSetup />} />
      <Route path="/homepage" element={<Homepage />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  )
}

export default App
