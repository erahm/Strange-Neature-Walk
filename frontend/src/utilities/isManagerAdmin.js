export const isManagerAdmin = (ability) => {
  const isAdmin = ability && ability.can('manage', 'all')
  const isManager = ability && ability.can('update', 'User') && !isAdmin
  return { isAdmin, isManager } 
}