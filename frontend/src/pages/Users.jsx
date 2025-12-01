import { useQuery, useMutation } from '@apollo/client/react'
import { GET_USERS, DELETE_USER } from '../queries/users'
import { useAbility } from '../ability'
import { CreateUserForm } from '../components/CreateUserForm'
import { isManagerAdmin } from '../utilities/isManagerAdmin'

export default function Users () {
  const { data, loading, error } = useQuery(GET_USERS)
  const [deleteUser] = useMutation(DELETE_USER, { refetchQueries: ['GetUsers'] })
  const ability = useAbility()

  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error: {error.message}</p>
  }

  const handleDelete = async (id) => {
    try {
      await deleteUser({ variables: { id } })
    } catch (err) {
      console.error('delete failed', err)
    }
  }

  const { isAdmin, isManager } = isManagerAdmin(ability);
  const users = data?.users;

  return (
    <div>
      {(() => {
        if (!isAdmin) {
          return null
        }
        return (<CreateUserForm />) 
      })()}

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> ({user.email}) &nbsp;
            {(() => {
              return (
                <>
                  {(isAdmin || isManager) && <em> ({user.role})</em>}
                  {isAdmin && <button onClick={() => handleDelete(user.id)}>Delete</button>}
                </>
              )
            })()}
          </li>
        ))}
      </ul>
    </div>
  )
}
