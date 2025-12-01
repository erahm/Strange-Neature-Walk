import { AbilityBuilder, Ability } from '@casl/ability';
import { privilegeSets } from './privilegeSets.js';

export function defineAbilitiesForUser(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);
  const privileges = privilegeSets(can, cannot);
  if (!user) {
    // unauthenticated users can read User listings
    privileges.noAccess('User');
    privileges.readOnly('ExhibitCategory');
    privileges.readOnly('Exhibit');
  } else if (user.role === 'ADMIN') {
    privileges.fullAccess();
  } else if (user.role === 'MANAGER') {
    // Managers can read all users, and update any user's name/email
    privileges.readUpdate('User');
    privileges.readUpdate('ExhibitCategory');
    privileges.readUpdate('Exhibit');
  } else if (user.role === 'VIEWER') {
    // regular user
    privileges.readOnly('User');
    privileges.readOnly('ExhibitCategory');
    privileges.readOnly('Exhibit');
  }
  return new Ability(rules);
} 