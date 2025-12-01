import { createContext, useContext } from 'react'
import { AbilityBuilder, Ability } from '@casl/ability'

export const AbilityContext = createContext(null)

export const privilegeSets = (can, cannot) => ({
  readOnly: (asset) => {
    return [
      can('read', asset),
      cannot('create', asset),
      cannot('update', asset),
      cannot('delete', asset),
    ]
  },
  readUpdate: (asset) => {
    return [
      can('read', asset),
      cannot('create', asset),
      can('update', asset),
      cannot('delete', asset),
    ]
  },
  noAccess: (asset) => {
    return [
      cannot('read', asset),
      cannot('create', asset),
      cannot('update', asset),
      cannot('delete', asset),
    ]
  },
  fullAccess: () => can('manage', 'all'),
});

export function defineAbilityFor(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability)
  const privileges = privilegeSets(can, cannot)

  if (!user) {
    privileges.noAccess('User');
    privileges.readOnly('ExhibitCategory');
    privileges.readOnly('Exhibit');
  } else if (user.role === 'ADMIN') {
    privileges.fullAccess();
  } else if (user.role === 'MANAGER') {
    privileges.readUpdate('User');
    privileges.readUpdate('ExhibitCategory');
    privileges.readUpdate('Exhibit');
  } else {
    privileges.readOnly('User');
    privileges.readOnly('ExhibitCategory');
    privileges.readOnly('Exhibit');
  }

  return new Ability(rules)
}

export function useAbility() {
  return useContext(AbilityContext)
}

export default AbilityContext
