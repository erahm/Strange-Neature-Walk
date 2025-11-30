import { subject } from '@casl/ability'
import { defineAbilitiesForUser } from '../authz/userPrivileges.js'

describe('defineAbilitiesForUser', () => {
  test('unauthenticated cannot create/read/update/delete', () => {
    const ability = defineAbilitiesForUser(null)
    expect(ability.can('read', 'User')).toBe(false)
    expect(ability.can('create', 'User')).toBe(false)
    expect(ability.can('update', subject('User', { id: 1 }))).toBe(false)
    expect(ability.can('delete', subject('User', { id: 1 }))).toBe(false)
  })

  test('admin can manage all', () => {
    const ability = defineAbilitiesForUser({ id: 1, role: 'ADMIN' })
    expect(ability.can('manage', 'all')).toBe(true)
    expect(ability.can('delete', subject('User', { id: 2 }))).toBe(true)
  })

  test('manager can update but not create or delete', () => {
    const ability = defineAbilitiesForUser({ id: 2, role: 'MANAGER' })
    expect(ability.can('create', 'User')).toBe(false)
    expect(ability.can('update', subject('User', { id: 3 }))).toBe(true)
    expect(ability.can('delete', subject('User', { id: 3 }))).toBe(false)
  })

  test('viewer cannot create/update/delete', () => {
    const ability = defineAbilitiesForUser({ id: 3, role: 'VIEWER' })
    expect(ability.can('create', 'User')).toBe(false)
    expect(ability.can('update', subject('User', { id: 3 }))).toBe(false)
    expect(ability.can('delete', subject('User', { id: 3 }))).toBe(false)
  })
})
