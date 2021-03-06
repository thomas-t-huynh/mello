const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;