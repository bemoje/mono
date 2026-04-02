import { useEffect } from 'react'
import { useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export function App() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    const response = await fetch('/api/users')
    const data = await response.json()
    setUsers(data)
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      if (response.ok) {
        setName('')
        setEmail('')
        await fetchUsers()
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      alert('Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchUsers()
      }
    } catch (error) {
      alert('Failed to delete user')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="container">
      <h1>User Management</h1>

      <form onSubmit={createUser} className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            return setName(e.target.value)
          }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            return setEmail(e.target.value)
          }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>

      <div className="users">
        <h2>Users ({users.length})</h2>
        {users.map((user) => {
          return (
            <div key={user.id} className="user-card">
              <div>
                <strong>{user.name}</strong>
                <br />
                <span>{user.email}</span>
              </div>
              <button
                onClick={() => {
                  return deleteUser(user.id)
                }}
                className="delete-btn">
                Delete
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
