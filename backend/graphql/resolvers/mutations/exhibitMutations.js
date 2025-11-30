import { subject } from "@casl/ability";

export const exhibitMutations = {
  createExhibit: async (_, { name, description, categoryId, imageUrl }, { prisma, ability, user }) => {
    if (!ability || !ability.can('create', 'Exhibit')) {
      throw new Error('Insufficient permissions to create exhibit', { code: 'FORBIDDEN', status: 403 });
    }
    return prisma.exhibit.create({
      data: {
        name,
        description,
        categoryId,
        imageUrl,
        createdById: user.id,
        updatedById: user.id,
      },
      include: {
        category: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  },
  updateExhibit: async (_, { id, name, description, categoryId, imageUrl }, { prisma, ability, user }) => {
    const existing = await prisma.exhibit.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Exhibit not found', { code: 'NOT_FOUND', status: 404 });
    }

    const target = subject('Exhibit', { id });
    if (!ability || !ability.can('update', target)) {
      throw new Error('Insufficient permissions to update this exhibit', { code: 'FORBIDDEN', status: 403 });
    }

    return prisma.exhibit.update({
      where: { id },
      data: {
        name,
        description,
        categoryId,
        imageUrl,
        updatedById: user.id,
      },
      include: {
        category: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  },
  deleteExhibit: async (_, { id }, { prisma, ability }) => {
    const existing = prisma.exhibit.findUnique({ where: { id } });
    if (!existing) {
      throw new Error('Exhibit not found', { code: 'NOT_FOUND', status: 404 });
    }
    const target = subject('Exhibit', { id });
    if (!ability || !ability.can('delete', target)) {
      throw new Error('Insufficient permissions to delete this exhibit', { code: 'FORBIDDEN', status: 403 });
    }
    return prisma.exhibit.delete({
      where: { id },
      include: {
        category: true,
        createdBy: true,
        updatedBy: true,
      },
    });
  }
}