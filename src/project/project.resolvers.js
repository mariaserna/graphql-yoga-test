export default {
    Query: {
      projects: (_, __, ctx) => ctx.models.Project
        .find({})
        .populate('users'),
    },
    Mutation: {
      createProject: async (_, args, ctx) => {
        const { name } = args;
        const namedb = await ctx.models.Project.exists({ name });
  
        if (namedb) {
          throw new Error('This project name already exists')
        }
        const projectCreated = await ctx.models.Project.create(args);
  
        return projectCreated;
      },
      addUserToProject: async (_, { projectId, userId }, ctx) => {
        const userToAdd = await ctx.models.User.exists({
          _id: userId,
        });

        if (!userToAdd) {
          throw new Error(`${userId} not found`)
        }

        const projectToAdd = await ctx.models.Project.findOne({
          _id: projectId,
        });

        if (!projectToAdd) {
          throw new Error(`${projectId} not found`)
        }

        // projectToAdd.users = [
        //   ...projectToAdd.users,
        //   userId,
        // ];
        projectToAdd.users.push(userId);

        return projectToAdd.save();
      }
    },
    Project: {
      id: (root) => {
        console.log('RESOLVER ID')
        return root._id;
      }
    }
};