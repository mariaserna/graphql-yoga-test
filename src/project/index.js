import projectResolver from './project.resolvers';
import projectModel from './project.model';
import projectSchema from './project.graphql';

export default {
    resolvers: projectResolver,
    schema: projectSchema,
    model: projectModel,
};