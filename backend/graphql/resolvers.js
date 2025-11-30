import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { subject } from '@casl/ability';

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

export const resolvers = {
  Query: {
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
  },
  Mutation: {
    register: async (_, { name, email, password }, { prisma }) => {
      const exists = await prisma.user.findUnique({ where: { email } });
      if (exists) throw new Error('Email already in use', { code: 'EMAIL_IN_USE', status: 409 });

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name, email, password: hashed } });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },
    login: async (_, { email, password }, { prisma }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('No such user', { code: 'USER_NOT_FOUND', status: 404 });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password', { code: 'INVALID_PASSWORD', status: 401 });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },
    createUser: async (_, { name, email, password, role }, { prisma, ability, user }) => {
      if (!ability || !ability.can('create', 'User')) throw new Error('Insufficient permissions to create user', { code: 'FORBIDDEN', status: 403 });
      if (role === 'ADMIN' && (!user || user.role !== 'ADMIN')) throw new Error('Only admins can create ADMIN users', { code: 'FORBIDDEN', status: 403 });

      const hashed = await bcrypt.hash(password, 10);
      const data = { name, email, password: hashed, role };
      return prisma.user.create({ data });
    },
    updateUser: async (_, { id, name, email, password }, { prisma, ability }) => {
      const target = subject('User', { id });
      if (!ability || !ability.can('update', target)) throw new Error('Insufficient permissions to update user', { code: 'FORBIDDEN', status: 403 });
      if (password) data.password = await bcrypt.hash(password, 10);

      const data = { name, email };
      return prisma.user.update({ where: { id }, data });
    },
    deleteUser: async (_, { id }, { prisma, ability }) => {
      const target = subject('User', { id });
      if (!ability || !ability.can('delete', target)) throw new Error('Insufficient permissions to delete user', { code: 'FORBIDDEN', status: 403 });
      return prisma.user.delete({ where: { id } });
    }
  }
};
