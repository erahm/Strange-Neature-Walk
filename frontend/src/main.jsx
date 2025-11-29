import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client/react'
import App from './App'
import { client } from './apolloClient'
import { AbilityProvider } from './AbilityProvider'

import './styles.css'

function Root () {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    }
    return null
  })

  useEffect(() => {
    function onUserChanged () {
      const newUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
      setUser(newUser)
    }
    // custom event for same-window auth operations
    window.addEventListener('userChanged', onUserChanged)
    // storage event for multi-tab updates
    window.addEventListener('storage', onUserChanged)
    return () => {
      window.removeEventListener('userChanged', onUserChanged)
      window.removeEventListener('storage', onUserChanged)
    }
  }, [])

  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <AbilityProvider user={user}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AbilityProvider>
      </ApolloProvider>
    </React.StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
