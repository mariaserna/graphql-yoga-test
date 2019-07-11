import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import mongoose from 'mongoose';
import userModel from './user.model';

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const models = {
  User: userModel,
};

const typeDefs = `
  input UserInput {
    name: String!
    email: String!
  }
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    hello(name: String): String!
    user: User!
    users: [User]!
  }
  type Mutation {
      #this mutation returns null
      hello(name: String!): Boolean
      createUser(name: String!, email: String!): User!
      createUsers(users: [UserInput!]!): [User]!
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    user: () => {
      return {
        email: 'anto@gmail.com',
      };
    },
    users: async (_, __, ctx) => {
      const users = await ctx.models.User.find({});

      return users;
    },
  },
  Mutation: {
    hello: (root, args, ctx) => true,
    createUser: async (_, args, ctx) => {
      const { email } = args;
      const emaildb = await ctx.models.User.exists({ email })

      if (emaildb) {
        throw new Error('Email already exists')
      }

      const userCreated = await ctx.models.User.create(args);

      return userCreated;
    },
    createUsers: async (_, args, ctx) => {
      
      const { users } = args;
      const allEmails = users.map(user => user.email);
      const hasDuplicates = allEmails.some((val,i) => allEmails.indexOf(val) != i);
      
      if (hasDuplicates) {
        throw new Error('Duplicates!')
      }
      
      const emailExistOnDB = await ctx.models.User.exists({ email: {$in: allEmails } });

      if (emailExistOnDB) {
        throw new Error('Email already exist!')
      }

      const usersCreated = await ctx.models.User.insertMany(users);

      return usersCreated;
    },
  },
  User: {
    id: (root) => {
      console.log('RESOLVER ID')
      return root._id;
    }
  }
}

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
