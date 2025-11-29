const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ForbiddenError } = require('@apollo/server/errors');
const { subject } = require('@casl/ability');

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';

module.exports = {
  Query: {
    users: async (_, __, { prisma, ability }) => {
      if (!ability || !ability.can('read', 'User')) throw new ForbiddenError('Not authorized');
      return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    },
    user: async (_, { id }, { prisma, ability }) => {
      const target = subject('User', { id });
      if (!ability || !ability.can('read', target)) throw new ForbiddenError('Not authorized');
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
      if (exists) throw new Error('Email already in use');

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name, email, password: hashed } });
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },
    login: async (_, { email, password }, { prisma }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('No such user');
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('Invalid password');
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      return { token, user };
    },
    createUser: async (_, { name, email, password, role }, { prisma, ability, user }) => {
      if (!ability || !ability.can('create', 'User')) throw new ForbiddenError('Not authorized');
      // Only admins can create ADMIN users
      if (role === 'ADMIN' && (!user || user.role !== 'ADMIN')) throw new ForbiddenError('Only admins can create ADMIN users');
      const hashed = await bcrypt.hash(password, 10);
      const data = { name, email, password: hashed };
      if (role) data.role = role;
      return prisma.user.create({ data });
    },
    updateUser: async (_, { id, name, email, password }, { prisma, ability }) => {
      const target = subject('User', { id });
      if (!ability || !ability.can('update', target)) throw new ForbiddenError('Not authorized');
      const data = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (password) data.password = await bcrypt.hash(password, 10);
      return prisma.user.update({ where: { id }, data });
    },
    deleteUser: async (_, { id }, { prisma, ability }) => {
      const target = subject('User', { id });
      if (!ability || !ability.can('delete', target)) throw new ForbiddenError('Not authorized');
      return prisma.user.delete({ where: { id } });
    }
  }
};
