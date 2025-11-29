require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { PrismaClient } = require('@prisma/client');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { defineAbilitiesForUser } = require('./authz/userPrivileges');

const prisma = new PrismaClient();

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(json());

  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret';


  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
        let user = null;
        let ability = null;
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded && decoded.userId) {
              user = await prisma.user.findUnique({ where: { id: decoded.userId } });
            }
          } catch (e) {
            // invalid token, ignore
          }
        }
        ability = defineAbilitiesForUser(user);
        return { prisma, user, ability };
      }
    })
  );

  const port = process.env.PORT || 4000;
  app.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://localhost:${port}/graphql`);
  });
}

startServer().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
});
