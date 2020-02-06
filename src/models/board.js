const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    columns: [{
      columnID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Column'
      }  
    }],
    users: [{
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }]
}, {
    timestamps: true
})


const Board = mongoose.model('Board', boardSchema);

module.exports = Board;