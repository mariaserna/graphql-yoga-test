import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    description: String,
    team: {
        type: String,
        required: true,
        enum: [
            'UI',
            'QA',
            'DESIGN',
            'ADMIN',
        ],
    }
});

export default mongoose.model('Project', ProjectSchema, 'projects');
