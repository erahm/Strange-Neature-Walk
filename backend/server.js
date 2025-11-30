import * as dotEnv from 'dotenv';
dotEnv.config();
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/typeDefs.js';
import { resolvers } from './graphql/resolvers.js';
import { defineAbilitiesForUser } from './authz/userPrivileges.js';

const prisma = new PrismaClient();
const { json } = bodyParser;

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(json());

  // Mount GraphiQL at /graphiql
  import('./graphql/graphiql.js').then(({ default: graphiqlRouter }) => {
    app.use('/graphiql', graphiqlRouter);
  });

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
