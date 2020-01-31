const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Board = require('../models/board')

router.post('/boards', auth, async (req, res) => {
    const board = new Board({
        ...req.body,
        owner: req.user.id,
        users: [{userID: req.user._id}]
    });
    try {
        await board.save()
        res.status(201).send({ board })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/boards/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['users', 'owner', 'columnIds']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes((update))
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }
    if (updates[0] === 'users') {
        req.body.users = req.body.users.split(",") 
    }
    try {
        const board = await Board.findOne({ _id: req.params.id })
        
        
        // const task = await Task.findByIdAndUpdate(_id, req.body,{ new: true })
        if (!board) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => board[update] = req.body[update])
        
        await board.save()
        res.send(board)
    } catch(e) {
        res.status(400).send(e)
    }

})

router.delete('/boards/:id', auth, async (req, res) => {
    try {
        const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.user._id  })
        if (!board) {
            return res.status(404).send()
        }
    
        res.send(board)
    
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router