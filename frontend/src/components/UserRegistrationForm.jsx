import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { REGISTER } from '../queries/register';

export const UserRegistrationForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [register, { loading, error }] = useMutation(REGISTER)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {return}
    const { data } = await register({ variables: { name, email, password } })
    if (data?.register?.token) {
      localStorage.setItem('token', data.register.token)
      localStorage.setItem('user', JSON.stringify(data.register.user))
      if (typeof window !== 'undefined') {window.dispatchEvent(new Event('userChanged'))}
      navigate('/users')
    }
  }

  return (
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Register</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}