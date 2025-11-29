import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Users from './pages/Users'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App () {
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const currentUser = typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }
  return (
    <div className="app">
      <nav>
        <h1>Strange Neature Walk</h1>
        <Link to="/">Home</Link>
        {currentUser && <Link to="/users">Users</Link>}
        {!token && <Link to="/login">Login</Link>}
        {!token && <Link to="/register">Register</Link>}
        {currentUser && <span style={{ marginLeft: 8 }}>Hello, {currentUser.name} ({currentUser.role})</span>}
        {token && <button onClick={handleLogout}>Logout</button>}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
