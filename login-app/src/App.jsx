import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import AccountSetup from './components/AccountSetup'
import Homepage from './components/Homepage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/account-setup" element={<AccountSetup />} />
      <Route path="/homepage" element={<Homepage />} />
    </Routes>
  )
}

export default App
