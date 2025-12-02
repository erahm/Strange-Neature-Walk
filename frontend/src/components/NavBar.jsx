import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const currentUser = typeof window !== 'undefined' && localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('userChanged'))
    }
    navigate('/')
  }

  return (
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
  )
};