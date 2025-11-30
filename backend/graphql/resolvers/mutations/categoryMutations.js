import { subject } from "@casl/ability";

export const categoryMutations = {
  createExhibitCategory: async (_, { name }, { prisma, ability }) => {
    if (!ability || !ability.can('create', 'ExhibitCategory')) throw new Error('Insufficient permissions to create exhibit category', { code: 'FORBIDDEN', status: 403 });
    return prisma.exhibitCategory.create({ data: { name } });
  },
  updateExhibitCategory: async (_, { id, name }, { prisma, ability }) => {
    const target = subject('ExhibitCategory', { id });
    if (!ability || !ability.can('update', target)) throw new Error('Insufficient permissions to update exhibit category', { code: 'FORBIDDEN', status: 403 });
    return prisma.exhibitCategory.update({ where: { id }, data: { name } });
  },
  deleteExhibitCategory: async (_, { id }, { prisma, ability }) => {
    const target = subject('ExhibitCategory', { id });
    if (!ability || !ability.can('delete', target)) throw new Error('Insufficient permissions to delete exhibit category', { code: 'FORBIDDEN', status: 403 });
    return prisma.exhibitCategory.delete({ where: { id } });
  }
}