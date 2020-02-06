const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Column = require('../models/column')
const mongoose = require('mongoose')

router.post('/columns', auth, async (req, res) => {
    const column = new Column({
        ...req.body,
    });
    try {
        await column.save()
        res.status(201).send({ column })
    } catch (e) {
        res.status(400).send(e)
    }
})

// router.patch('/boards/:id', auth, async (req, res) => {
//     const _id = req.params.id;
//     const update = Object.keys(req.body)[0]
//     const allowedUpdates = ['users', 'owner', 'columns']
//     const isValidOperation = allowedUpdates.includes(update)
//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid update' })
//     }
//     try {
//         const board = await Board.findOne({ _id: _id })

//         if (!board) {
//             return res.status(404).send()
//         }
//         if (update === 'users') {
//             board[update].push({ userID: req.body.users})
//         } else if (update === 'columns') {
//             board[update].push({ columnID: req.body.columns})
//         } else {
//             board[update] = req.body.owner
//         }
        
//         await board.save()
//         res.send(board)
//     } catch(e) {
//         res.status(400).send(e)
//     }

// })

// router.delete('/boards/:id', auth, async (req, res) => {
//     try {
//         const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.user._id  })
//         if (!board) {
//             return res.status(404).send()
//         }
    
//         res.send(board)
    
//     } catch (e) {
//         res.status(500).send()
//     }
// })

module.exports = router