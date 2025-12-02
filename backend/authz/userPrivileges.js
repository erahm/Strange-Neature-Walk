import { AbilityBuilder, Ability } from '@casl/ability';
import { privilegeSets } from './privilegeSets.js';

export function defineAbilitiesForUser(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);
  const privileges = privilegeSets(can, cannot);
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
  } else if (user.role === 'VIEWER') {
    privileges.readOnly('User');
    privileges.readOnly('ExhibitCategory');
    privileges.readOnly('Exhibit');
  }
  return new Ability(rules);
} 