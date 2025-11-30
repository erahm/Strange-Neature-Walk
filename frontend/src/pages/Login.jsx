import React, { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../queries/login'


export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { loading, error }] = useMutation(LOGIN)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email || !password) {return}
    const { data } = await login({ variables: { email, password } })
    if (data?.login?.token) {
      localStorage.setItem('token', data.login.token)
      localStorage.setItem('user', JSON.stringify(data.login.user))
      // notify global state to update CASL ability
      if (typeof window !== 'undefined') {window.dispatchEvent(new Event('userChanged'))}
      navigate('/users')
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}
