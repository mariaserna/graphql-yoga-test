export default {
    Query: {
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
};
