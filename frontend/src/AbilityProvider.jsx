import React, { useEffect, useMemo, useState } from 'react'
import { defineAbilityFor, AbilityContext } from './ability'

export function AbilityProvider ({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch (e) {
      return null
    }
  })

  useEffect(() => {
    function onUserChanged (e) {
      const newUser = e?.detail ?? (() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null') } catch (err) { return null }
      })()
      setUser(newUser)
    }

    window.addEventListener('userChanged', onUserChanged)
    // listen to storage events (other tabs)
    window.addEventListener('storage', onUserChanged)
    return () => {
      window.removeEventListener('userChanged', onUserChanged)
      window.removeEventListener('storage', onUserChanged)
    }
  }, [])

  const ability = useMemo(() => defineAbilityFor(user), [user])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}
