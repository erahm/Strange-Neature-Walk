import { AbilityBuilder, Ability } from '@casl/ability';

export function defineAbilitiesForUser(user) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);
  if (!user) {
    // unauthenticated users can read User listings
    cannot('read', 'User');
    cannot('create', 'User');
    cannot('update', 'User');
    cannot('delete', 'User');
  } else if (user.role === 'ADMIN') {
    can('manage', 'all');
  } else if (user.role === 'MANAGER') {
    // Managers can read all users, create new users (except ADMIN), and update any user's name/email
    can('read', 'User');
    cannot('create', 'User');
    can('update', 'User');
    cannot('delete', 'User');
  } else if (user.role === 'VIEWER') {
    // regular user
    can('read', 'User');
    cannot('create', 'User');
    cannot('update', 'User', { id: user.id });
    cannot('delete', 'User', { id: user.id });
  }
  return new Ability(rules);
} 