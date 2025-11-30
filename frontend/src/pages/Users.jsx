import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { GET_USERS, DELETE_USER, CREATE_USER_ADMIN } from '../queries/users'
import { useAbility } from '../ability'

export default function Users () {
  const { data, loading, error } = useQuery(GET_USERS)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [deleteUser] = useMutation(DELETE_USER, { refetchQueries: ['GetUsers'] })
  const [createUserAdmin] = useMutation(CREATE_USER_ADMIN, { refetchQueries: ['GetUsers'] })
  const [roleToCreate, setRoleToCreate] = useState('VIEWER')
  const ability = useAbility()

  if (loading) {return <p>Loading...</p>}
  if (error) {return <p>Error: {error.message}</p>}

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

  const handleDelete = async (id) => {
    try {
      await deleteUser({ variables: { id } })
    } catch (err) {
      console.error('delete failed', err)
    }
  }


  const isAdmin = ability && ability.can('manage', 'all')
  const isManager = ability && ability.can('create', 'User') && !isAdmin

  return (
    <div>
      {(() => {
        if (!isAdmin && !isManager) {return null}
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
                {isAdmin && <option value="ADMIN">ADMIN</option>}
              </select>
              <button type="submit">Create</button>
            </form>
          </div>
        )
      })()}

      <ul>
        {data?.users?.map((u) => (
          <li key={u.id}>
            <strong>{u.name}</strong> ({u.email}) &nbsp;
            {(() => {
              return (
                <>
                  {isAdmin || isManager && <em> ({u.role})</em>}
                  {isAdmin && <button onClick={() => handleDelete(u.id)}>Delete</button>}
                </>
              )
            })()}
          </li>
        ))}
      </ul>
    </div>
  )
}
