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