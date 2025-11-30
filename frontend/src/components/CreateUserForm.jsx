import { useMutation } from "@apollo/client/react"
import { CREATE_USER_ADMIN } from "../queries/users"
import { useState } from "react";

export const CreateUserForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleToCreate, setRoleToCreate] = useState('VIEWER')

  const [createUserAdmin] = useMutation(CREATE_USER_ADMIN, { refetchQueries: ['GetUsers'] })

  const handleCreateByAdmin = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {return}
    try {
      await createUserAdmin({ variables: { name, email, password, role: roleToCreate } })
      setName('')
      setEmail('')
      setPassword('')
      setRoleToCreate('VIEWER')
    } catch (err) {
      console.error('create failed', err)
    }
  }

  return (
    <div>
      <h3>Create (admin/manager)</h3>
      <form onSubmit={handleCreateByAdmin}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select value={roleToCreate} onChange={(e) => setRoleToCreate(e.target.value)}>
          <option value="VIEWER">VIEWER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}