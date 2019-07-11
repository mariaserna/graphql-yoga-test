import dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';
import mongoose from 'mongoose';
import userModel from './user.model';
import projectModel from './project.model';

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const models = {
  User: userModel,
  Project: projectModel,
};

const typeDefs = `
  input UserInput {
    name: String!
    email: String!
  }
  enum TeamEnum {
    UI
    QA
    DESIGN
    ADMIN
  }
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Project {
    id: ID!
    name: String!
    description: String
    team: TeamEnum!
  }
  type Query {
    hello(name: String): String!
    user: User!
    users: [User]!
    project: Project!
    projects: [Project]!
  }
  type Mutation {
      #this mutation returns null
      hello(name: String!): Boolean
      createUser(name: String!, email: String!): User!
      createUsers(users: [UserInput!]!): [User]!
      createProject(name: String!, description: String, team: TeamEnum!): Project!
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
    projects: async (_, __, ctx) => {
      const projects = await ctx.models.Project.find({});

      return projects;
    },
  },
  Mutation: {
    hello: (root, args, ctx) => true,
    createProject: async (_, args, ctx) => {
      console.log('project args', args)
      const { name } = args;
      const namedb = await ctx.models.Project.exists({ name });

      if (namedb) {
        throw new Error('This project name already exists')
      }
      const projectCreated = await ctx.models.Project.create(args);

      return projectCreated;
    },
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
      const hasDuplicates = allEmails.some((val, i) => allEmails.indexOf(val) != i);
      
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
