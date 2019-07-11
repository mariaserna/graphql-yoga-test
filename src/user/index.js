import userResolver from './user.resolvers';
import userModel from './user.model';
import userSchema from './user.graphql';

export default {
    resolvers: userResolver,
    schema: userSchema,
    model: userModel,
};