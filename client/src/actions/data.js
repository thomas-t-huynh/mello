import axios from 'axios'

export const SET_BOARDS = "SET_BOARDS";
export const SET_COLUMNS = "SET_COLUMNS";
export const SET_TASKS = "SET_TASKS";

export const setBoards = (boards) => ({
    type: SET_BOARDS,
    payload: boards
})

export const setColumns = (columns) => ({
    type: SET_COLUMNS,
    payload: columns
})

export const setTasks = (tasks) => ({
    type: SET_TASKS,
    payload: tasks
})

export const getBoards = () => (dispatch, getState) => {
    const { headers } = getState().users
    axios
    .get(`${process.env.REACT_APP_API_URI}/boards`, { headers })
    .then(res => {
      const newState = {
        boards: {
          ...res.data.usersBoard
        },
        boardOrder: [...Object.keys(res.data.usersBoard)]
      };
      dispatch(setBoards(newState))
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
      dispatch(setColumns(fetchedColumns));
    })
    .catch(err => {
      console.log(err);
    })
}

export const getTasks = boardId => (dispatch, getState) => {
    const { headers } = getState().users
    axios
    .get(`${process.env.REACT_APP_API_URI}/boards/${boardId}/columns/tasks`, { headers })
    .then(res => {
      let fetchedTasks = {};
      res.data.tasks.forEach(task => (fetchedTasks[task._id] = task));
      dispatch(setTasks(fetchedTasks))
    })
    .catch(err => console.log(err));
}