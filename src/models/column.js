const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    taskIds: [{
      task: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Column'
      }  
    }]
}, {
    timestamps: true
})


const Column = mongoose.model('Column', columnSchema);

module.exports = Column;