import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import mongoose from 'mongoose';
import { models, resolvers, typeDefs } from './graphql';

// const types = [
//   userTypeDefs,
//   projectTypeDefs,
// ];

// const resolversArray = [
//   userResolver,
//   projectResolver,
// ];

// const typeDefs = mergeTypes(types, { all: true });
// const resolvers = mergeResolvers(resolversArray);

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

// const models = {
//   User: userModel,
//   Project: projectModel,
// };

const db = mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@workshop-zobw5.mongodb.net/workshop`)
  .then(() => {
    const server = new GraphQLServer({
      typeDefs,
      resolvers,
      context: {
        models,
        db,
      },
    });

    server.start(() => console.log('Server is running on localhost:4000'));
  })
  .catch((error) => {
    console.log(error)
  });
