const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    taskIds: [{
      taskId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Task'
      }  
    }]
}, {
    timestamps: true
})


columnSchema.virtual('board', {
    ref: 'Board',
    localField: '_id',
    foreignField: 'columns'
})

const Column = mongoose.model('Column', columnSchema);

module.exports = Column;