import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: String,
    description: String,
    team: String,
});

export default mongoose.model('Project', ProjectSchema, 'projects');
