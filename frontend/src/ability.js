import { createContext, useContext } from 'react'
import { AbilityBuilder, Ability } from '@casl/ability'

export const AbilityContext = createContext(null)

export function defineAbilityFor(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability)

  if (!user) {
    can('read', 'User')
    cannot('create', 'User')
    cannot('update', 'User')
    cannot('delete', 'User')
  } else if (user.role === 'ADMIN') {
    can('manage', 'all')
  } else if (user.role === 'MANAGER') {
    can('read', 'User')
    can('create', 'User')
    can('update', 'User')
    cannot('delete', 'User')
  } else {
    can('read', 'User')
    cannot('update', 'User', { id: user.id })
    cannot('delete', 'User', { id: user.id })
  }

  return new Ability(rules)
}

export function buildAbilityFor(user) {
  return defineAbilityFor(user)
}

export function useAbility() {
  return useContext(AbilityContext)
}

export default AbilityContext
