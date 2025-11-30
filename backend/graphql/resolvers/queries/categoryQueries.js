export const categoryQueries = {
  exhibitCategories: async (_, __, { prisma, ability }) => {
    if (!ability || !ability.can('read', 'ExhibitCategory')) {
      throw new Error('Not authorized', { code: 'FORBIDDEN', status: 403 });
    }
    return prisma.exhibitCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }
};