import { userMutations } from '../graphql/resolvers/mutations/userMutations.js'
import { defineAbilitiesForUser } from '../authz/userPrivileges.js'

describe('userMutations.updateUser permissions', () => {
  test('throws when ability cannot update', async () => {
    const context = {
      prisma: { user: { update: jest.fn(), findUnique: jest.fn() } },
      ability: defineAbilitiesForUser(null),
    }
    await expect(userMutations.updateUser(null, { id: 1, name: 'Jake' }, context)).rejects.toThrow()
  })

  test('allows admin to update any user', async () => {
    const updated = { id: 2, name: 'Updated' }
    const context = {
      prisma: { user: { update: jest.fn().mockResolvedValue(updated) } },
      ability: defineAbilitiesForUser({ id: 1, role: 'ADMIN' }),
    }
    const res = await userMutations.updateUser(null, { id: 2, name: 'Updated' }, context)
    expect(res).toEqual(updated)
    expect(context.prisma.user.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { name: 'Updated', email: undefined } })
  })

  test('viewer cannot update user', async () => {
    const viewer = { id: 3, role: 'VIEWER' }
    const context = {
      prisma: { user: { update: jest.fn().mockResolvedValue({ id: 3, name: 'Me' }) } },
      ability: defineAbilitiesForUser(viewer),
    }
    await expect(userMutations.updateUser(null, { id: 3, name: 'Me' }, context)).rejects.toThrow()
  })
})
