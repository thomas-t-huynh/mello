import axios from 'axios'

import { setUser } from "./users"

export const SET_DATA = "SET_BOARDS";

export const setData = (boards) => ({
    type: SET_DATA,
    payload: boards
})

export const getBoards = () => (dispatch, getState) => {
    const { headers } = getState().users
    axios
      .get(`${process.env.REACT_APP_API_URI}/boards`, { headers })
      .then(res => {
        const fetchedBoards = {
          boards: {
            ...res.data.usersBoard
          },
          boardOrder: [...Object.keys(res.data.usersBoard)]
        };
        dispatch(setData(fetchedBoards))
      })
      .catch(err => console.log(err));
}

export const addBoard = (title, editedBoard) => (dispatch, getState) => {
  const { headers, account } = getState().users
  const { data } = getState()
  let result = {}
  if (editedBoard) {
    result = axios.patch(`${process.env.REACT_APP_API_URI}/boards`, 
      { title, _id: editedBoard._id }, { headers }
    )
  } else {
    result = axios.post(`${process.env.REACT_APP_API_URI}/boards`,
     { title }, { headers }
    )
  }
  result
    .then(res => {
      if (editedBoard) {
        const updatedBoards = { boards: {...data.boards} }
        updatedBoards.boards[editedBoard._id].title = editedBoard.title
        dispatch(setData(updatedBoards))
        return
      }
      const { _id, owner, userIds } = res.data.board;
      const newBoardOrder = [...data.boardOrder, _id];

      const updatedAccount = {...account}
      updatedAccount.boardIds = [...updatedAccount.boardIds, { boardId: _id }]

      const updatedBoards = { boards: {...data.boards}, boardOrder: newBoardOrder }
      updatedBoards.boards[_id] = { _id, title, owner, userIds, columnIds: [] }

      dispatch(setData(updatedBoards))
      dispatch(setUser(updatedAccount))
    })
    .catch(err => console.log(err));
}

export const getColumns = boardId => (dispatch, getState) => {
    const { headers } = getState().users
    axios
      .get(`${process.env.REACT_APP_API_URI}/boards/${boardId}/columns`, { headers })
      .then(res => {
        const fetchedColumns = {};
        res.data.boardColumns.forEach(
          column => (fetchedColumns[column._id] = { ...column })
        );
        dispatch(setData({ columns: fetchedColumns }));
      })
      .catch(err => {
        console.log(err);
      })
}

export const addColumn = (
  boardId,
  columnTitle, 
  columnId
) => (dispatch, getState) => {
  const { headers } = getState().users
  const { data } = getState()
  if (columnId) {
    axios
      .patch(`${process.env.REACT_APP_API_URI}/boards/columns`,
        { _id: columnId, title: columnTitle },
        { headers }
      )
      .catch(err => console.log(err))
    let updatedData = {...data };
    const { columns } = updatedData
    columns[columnId].title = columnTitle;
    dispatch(setData({ columns }));
    return;
  }
  axios
    .post(
      `${process.env.REACT_APP_API_URI}/boards/${boardId}/columns`,
      { title: columnTitle },
      { headers }
    )
    .then(res => {
      const updatedData = { ...data }
      const { columns, boards } = updatedData
      columns[res.data.column._id] = res.data.column
      boards[res.data.board._id] = res.data.board
      dispatch(setData({ columns, boards }))
    })
    .catch(err => console.log(err));
}

export const reorderColumns = ({ boards }, updatedBoard) => (dispatch, getState) => {
  const { headers } = getState().users
  axios.patch(`${process.env.REACT_APP_API_URI}/boards`,
    {
      columnIds: updatedBoard.columnIds,
      _id: updatedBoard._id
    },
    { headers }
  )
  .catch(err => console.log(err))
  dispatch(setData({ boards }))
}

export const getTasks = boardId => (dispatch, getState) => {
    const { headers } = getState().users
    axios
      .get(`${process.env.REACT_APP_API_URI}/boards/${boardId}/columns/tasks`, { headers })
      .then(res => {
        let fetchedTasks = {};
        res.data.tasks.forEach(task => (fetchedTasks[task._id] = task));
        dispatch(setData({ tasks: fetchedTasks }))
      })
      .catch(err => console.log(err));
}

export const addTask = (
  boardId, 
  columnId, 
  taskDescription, 
  taskId
) => (dispatch, getState) => {
  const  { headers } = getState().users
  const { data } = getState()
  if (taskId) {
    axios
      .patch(`${process.env.REACT_APP_API_URI}/boards/columns/tasks`,
        { _id: taskId, content: taskDescription },
        { headers }
      )
      .catch(err => console.log(err))
    const updatedData = { ...data };
    const { tasks } = updatedData
    tasks[taskId].content = taskDescription;
    dispatch(setData({ tasks }))
    return;
  }
  axios
    .post(`${process.env.REACT_APP_API_URI}/boards/columns/tasks`,
      { content: taskDescription, columnId, boardId },
      { headers }
    )
    .then(res => {
      const {
        data: { task }
      } = res;
      const updatedData = { ...data }
      const { tasks, columns } = updatedData
      tasks[task._id] = { _id: task._id, content: task.content }
      columns[columnId].taskIds = [
        ...columns[columnId].taskIds,
        { taskId: task._id }
      ]
      dispatch(setData({ tasks, columns }))
    })
    .catch(err => console.log(err));
}

export const reorderTasks = ({ columns }, startColumn, endColumn=undefined) => (dispatch, getState) => {
  const { headers } = getState().users
  const startData = {
    _id: startColumn._id,
    title: startColumn.title,
    taskIds: startColumn.taskIds
  };
  if (!endColumn) {
    axios
      .patch(`${process.env.REACT_APP_API_URI}/boards/columns`, startData, { headers: headers })
      .catch(err => console.log(err));
  } else {
    const endData = {
      _id: endColumn._id,
      title: endColumn.title,
      taskIds: endColumn.taskIds
    }
    axios
      .patch(`${process.env.REACT_APP_API_URI}/boards/columns`,
        { startData, endData },
        { headers }
      )
      .catch(err => console.log(err))
  }
  dispatch(setData({ columns }))
}