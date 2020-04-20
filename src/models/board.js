const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    columnIds: [{
      columnId: {
          type: String,
          ref: 'Column'
      }  
    }],
    userIds: {
        type: Array
    }
}, {
    timestamps: true
})


const Board = mongoose.model('Board', boardSchema);

module.exports = Board;