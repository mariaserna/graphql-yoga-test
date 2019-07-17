import DataLoader from 'dataloader';
import ProjectModel from './project.model';

export default  () => new DataLoader(async(userIds) => {
    const projectsFound = await ProjectModel.find({
        users:
            {
                $in: userIds,
            },
        }).populate('users');
    
        const projects = userIds.map((userId) => {
            return projectsFound.filter((projectFound) => {
                return projectFound.users.some((user) => String(user._id) === String(userId));
            });
        });

        return projects;
});
