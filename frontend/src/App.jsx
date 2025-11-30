import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Exhibits from './pages/Exhibits'
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
        <Link to="/">Exhibits</Link>
        {currentUser && <Link to="/users">Users</Link>}
        <span className='user-management'>
          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/register">Register</Link>}
          {currentUser && <span className='user-info'>
            <div>Hello, {currentUser.name}</div>
            <div>({currentUser.role})</div>
            </span>}
          {token && <button onClick={handleLogout}>Logout</button>}
        </span>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Exhibits />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}
