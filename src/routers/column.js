const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Column = require('../models/column')
const Board = require('../models/board')


router.post('/boards/:boardId/columns', auth, async (req, res) => {
    const _id = req.params.boardId;
    const column = new Column({
        ...req.body,
    });
    try {
        const board = await Board.findOne({ _id: _id })

        if (!board) {
            return res.status(404).send()
        }
        board["columnIds"].push({ columnId: column._id })
        await column.save()
        await board.save()
        res.status(201).send({ board })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/boards/:boardId/columns/:columnId', auth, async (req, res) => {
    const columnId = req.params.columnId
    
    try {
        const column = await Column.findOne({ _id: columnId })
        console.log(column)
        if (!column) {
            return res.status(404).send()
        }

        column["title"] = req.body.columnTitle

        await column.save()
        res.status(200).send({ column })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/boards/:boardId/columns/:columnId', auth, async (req, res) => {
    const columnId = req.params.columnId
    const boardId = req.params.boardId
    
    try {
        const column = await Column.findOneAndDelete({ _id: columnId })
        let board = await Board.findOne({ _id: boardId })

        board.columnIds = board.columnIds.filter((column) => column.columnId.toString() !== columnId)

        await board.save()

        res.status(200).send({ column })
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