const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')
const boardRouter = require('./routers/board')

const app = express();
const port = process.env.PORT 

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.use(boardRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
