export default {
    Query: {
      projects: async (_, __, ctx) => {
        const projects = await ctx.models.Project.find({});
  
        return projects;
      },
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
    },
};