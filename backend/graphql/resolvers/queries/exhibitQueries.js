import { subject } from "@casl/ability";

export const exhibitQueries = {
  exhibits: async (_, __, { prisma, ability }) => {
    if (!ability || !ability.can('read', 'Exhibit')) {
      throw new Error('Not authorized', { code: 'FORBIDDEN', status: 403 });
    }
    return prisma.exhibit.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  },
  exhibit: async (_, { id }, { prisma, ability }) => {
    const target = subject('Exhibit', { id });
    if (!ability || !ability.can('read', target)) {
      throw new Error('Not authorized', { code: 'FORBIDDEN', status: 403 });
    }
    return prisma.exhibit.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }
};