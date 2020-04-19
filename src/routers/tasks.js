const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const Column = require('../models/column')
const Board = require('../models/board')
const auth = require('../middleware/auth')

router.post('/boards/columns/:columnId/tasks', auth,  async (req, res) => {
    //const task = new Task(req.body);
    const columnId = req.params.columnId
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const column = await Column.findOne({ _id: columnId })
        if (!column) {
            return res.status(404).send(0)
        }

        column["taskIds"].push({ taskId: task._id})

        await task.save()
        await column.save()
        res.status(201).send({ column })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/boards/:boardId/columns/:columnId/tasks/:taskId', auth, async (req, res) => {
    const taskId = req.params.taskId

    try {
        const task = await Task.findOne({ _id: taskId })
        
        if (!task) {
            res.status(404).send()
        }
        task.content = req.body.content
        await task.save()
        res.status(200).send({ task })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/boards/:boardId/columns/:columnId/tasks', auth, async (req, res) => {
    const columnId = req.params.columnId
    const sourceIndex = req.body.sourceIndex
    const destinationIndex = req.body.destinationIndex
    try {
        const column = await Column.findOne({ _id: columnId })

        if (!column) {
            res.status(404).send()
        }
        console.log(column.taskIds)
        const  sourceId = column.taskIds[sourceIndex]

        column.taskIds.splice(sourceIndex, 1)
        column.taskIds.splice(destinationIndex, 0, sourceId)

        await column.save()

        res.status(200).send({ column })
    } catch (e) {
        res.status(400).send(e)
    }
})


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc or :asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Task.find({ owner: req.user_id })
        // res.status(200).send(tasks)
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send();
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const task = await Task.findById(_id)

        const task = await Task.findOne({ _id, owner: req.user._id })
        if (task) {
            return res.status(200).send(task)
        }
        res.status(400).send();
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes((update))
    })
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // const task = await Task.findByIdAndUpdate(_id, req.body,{ new: true })
        if (!task) {
            return res.status(404).send()
        }


        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        // await task.delete()
        res.send(task)
    } catch(e) {
        res.status(500).send()
    }
})

module.exports = router