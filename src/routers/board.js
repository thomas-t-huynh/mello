const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Board = require('../models/board')
const User = require('../models/user');

router.get('/boards', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user.id })
    try {
        const boardTitles = await Board.find({})
        let usersBoard = {}
        boardTitles.forEach((board) => {
            const userBoardFound = board.userIds.find((user) => {
                return user.userId.toString() === req.user.id
            })
            if (userBoardFound) {
                usersBoard[board._id] =  { ...board._doc }
            }
        })
        res.status(200).send({ usersBoard })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/boards', auth, async (req, res) => {
    const board = new Board({
        title: req.body.title,
        owner: req.user.id,
        userIds: [{userId: req.user._id}]
    });
    try {
        const user = await User.findOne({ _id: req.user.id })
        user.boardIds.push({ boardId: board._id })
        await board.save()
        await user.save()
        res.status(201).send({ board })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/boards', auth, async (req, res) => {
    const boardId = req.body._id;
    const update = Object.keys(req.body)[0]
    const allowedUpdates = ['userIds', 'owner', 'columnIds', 'title']
    const isValidOperation = allowedUpdates.includes(update)
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }
    try {
        const board = await Board.findOne({ _id: boardId })
        if (!board) {
            return res.status(404).send()
        }
        if (update === 'userIds') {
            board[update].push({ userId: req.body.userIds})
        } else if (update === 'columnIds') {
            board[update] = req.body.columnIds
        } else if (update === 'title') {
            board[update] = req.body.title
        } else {
            board[update] = req.body.owner
        }
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