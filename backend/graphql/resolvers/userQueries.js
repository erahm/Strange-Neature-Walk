import { subject } from "@casl/ability"

export const userQueries = {
      users: async (_, __, { prisma, ability }) => {
      if (!ability || !ability.can('read', 'User')) throw new Error('Not authorized', { code: 'FORBIDDEN', status: 403 });
      return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    },
    user: async (_, { id }, { prisma, ability }) => {
      const target = subject('User', { id });
      if (!ability || !ability.can('read', target)) throw new Error('Not authorized', { code: 'FORBIDDEN', status: 403 });
      return prisma.user.findUnique({ where: { id } });
    }
    ,
    me: async (_, __, { user }) => {
      return user || null;
    }
}
