import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schema/typeDefs.js';
import resolvers from './resolvers/index.js';
import { getUserFromToken } from './utils/auth.js';

dotenv.config();

const app = express();
app.use(express.json());

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token.replace('Bearer ', ''));
    return { user };
  }
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB error:', err));

app.listen(process.env.PORT || 4000, () => {
  console.log(` Server ready at http://localhost:${process.env.PORT || 4000}/graphql`);
});
