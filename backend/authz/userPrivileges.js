import { AbilityBuilder, Ability } from '@casl/ability';
import { privilegeSets } from './privilegeSets.js';

export function defineAbilitiesForUser(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);
  const privileges = privilegeSets(can, cannot);
  if (!user) {
    // unauthenticated users can read User listings
    // cannot('read', 'User');
    // cannot('create', 'User');
    // cannot('update', 'User');
    // cannot('delete', 'User');
    privileges.noAccess('User');
  } else if (user.role === 'ADMIN') {
    privileges.fullAccess();
  } else if (user.role === 'MANAGER') {
    // Managers can read all users, create new users (except ADMIN), and update any user's name/email
    // can('read', 'User');
    // cannot('create', 'User');
    // can('update', 'User');
    // cannot('delete', 'User');
    privileges.readUpdate('User');
  } else if (user.role === 'VIEWER') {
    // regular user
    // can('read', 'User');
    // cannot('create', 'User');
    // cannot('update', 'User');
    // cannot('delete', 'User');
    privileges.readOnly('User');
  }
  return new Ability(rules);
} 