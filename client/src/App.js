import React from "react";
import "@atlaskit/css-reset";
import "./styles.css";
import initialData from "./init-data";
import styled from "styled-components";
import Board from "./component/Board";
import Home from "./Home";
import Header from "./component/Header";
import Login from "./Login";
import SignUp from "./SignUp";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialData
    }
  }


  componentDidMount() {
    const melloUser = window.localStorage.getItem("mello-user");
    if (melloUser) {
      const token = JSON.parse(melloUser);
      const headers = {
        "Content-Type": "application/json",
        Authorization: token
      };
      axios
        .get(`${process.env.REACT_APP_API_URI}/users/me`, { headers })
        .then(res => {
          const { history } = this.props
          if (history.location.pathname === "/") {
            history.push('/board')
          }
          this.setUserAccount({ ...res.data, token });
        })
        .catch(err => console.log(err));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.account !== this.state.account) {
      if (Object.keys(this.state.account).length > 0) {
        this.getBoards();
      }
    }
  }

  getBoards = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    // console.log('fetching boards....')
    axios
      .get(`${process.env.REACT_APP_API_URI}/boards`, {
        headers: headers
      })
      .then(res => {
        const newState = {
          boards: {
            ...res.data.usersBoard
          },
          boardOrder: [...Object.keys(res.data.usersBoard)]
        };
        this.setState({ ...newState });
      })
      .catch(err => console.log(err));
  };
  getColumns = boardId => {
    let columnIds = this.state.boards[boardId].columnIds;
    if (columnIds) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: this.state.account.token
      };
      axios
        .get(`${process.env.REACT_APP_API_URI}/boards/${boardId}/columns`, {
          headers: headers
        })
        .then(res => {
          const fetchedColumns = {};
          res.data.boardColumns.forEach(
            column => (fetchedColumns[column._id] = { ...column })
          );
          const newState = {
            ...this.state,
            columns: {
              ...this.state.columns,
              ...fetchedColumns
            }
          };
          this.setState(newState);
        })
        .catch(err => {
          console.log(err);
        })
        .then(() => {
          this.getTasks(boardId);
        });
    }
  };
  addBoard = (title, editedBoard = undefined) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    if (editedBoard) {
      axios.patch(`${process.env.REACT_APP_API_URI}/boards`, { title: title, _id: editedBoard._id }, { headers })
      .then(res => {
        let editedState = this.state;
        editedState.boards[editedBoard._id].title = editedBoard.title;
        this.setState(editedState);
      })
      .catch(err => console.log(err))
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_URI}/boards`,
          { title: title },
          {
            headers: headers
          }
        )
        .then(res => {
          console.log(res);
          const { _id, owner, userIds } = res.data.board;
          const newBoardOrder = [...this.state.boardOrder, _id];
          const newState = {
            ...this.state,
            account: {
              ...this.state.account,
              user: {
                ...this.state.account,
                boardIds: [
                  ...this.state.account.boardIds,
                  { boardId: _id }
                ]
              }
            },
            boards: {
              ...this.state.boards,
              [_id]: {
                _id: _id,
                title: title,
                owner: owner,
                userIds: userIds,
                columnsIds: []
              }
            },
            boardOrder: newBoardOrder
          };
          this.setState(newState);
        })
        .catch(err => console.log(err));
    }
  };

  addColumn = (boardId, columnTitle, columnId = undefined) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    if (columnId) {
      const data = {
        _id: columnId,
        title: columnTitle
      }
      axios.patch(`${process.env.REACT_APP_API_URI}/boards/columns`, data, { headers })
      .then(res => {
        // console.log(res)
      })
      .catch(err => console.log(err))
      let editedState = this.state;
      editedState.columns[columnId].title = columnTitle;
      this.setState(editedState);
      return;
    }
    axios
      .post(
        `${process.env.REACT_APP_API_URI}/boards/${boardId}/columns`,
        { title: columnTitle },
        {
          headers: headers
        }
      )
      .then(res => {
        const newState = {
          ...this.state,
          columns: {
            ...this.state.columns,
            [res.data.column._id]: res.data.column
          },
          boards: {
            ...this.state.boards,
            [res.data.board._id]: res.data.board
          }
        };
        this.setState(newState);
      })
      .catch(err => console.log(err));
  };

  addTask = (boardId, columnId, taskDescription, taskId = undefined) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    if (taskId) {
      const data = {
        _id: taskId,
        content: taskDescription
      }
      axios.patch(`${process.env.REACT_APP_API_URI}/boards/columns/tasks`, data, { headers })
      .then(res => console.log(res))
      .catch(err => console.log(err))
      const editedState = this.state;
      editedState.tasks[taskId].content = taskDescription;
      this.setState(editedState);
      return;
    }
    const data = {
      content: taskDescription,
      columnId,
      boardId
    };
    axios
      .post(`${process.env.REACT_APP_API_URI}/boards/columns/tasks`, data, {
        headers: headers
      })
      .then(res => {
        const {
          data: { task }
        } = res;

        const newState = {
          ...this.state,
          tasks: {
            ...this.state.tasks,
            [task._id]: {
              _id: task._id,
              content: task.content
            }
          },
          columns: {
            ...this.state.columns,
            [columnId]: {
              ...this.state.columns[columnId],
              taskIds: [
                ...this.state.columns[columnId].taskIds,
                { taskId: task._id }
              ]
            }
          }
        };
        this.setState(newState);
      })
      .catch(err => console.log(err));
  };

  getTasks = boardId => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    axios
      .get(`${process.env.REACT_APP_API_URI}/boards/${boardId}/columns/tasks`, {
        headers: headers
      })
      .then(res => {
        let newTasks = {};
        res.data.tasks.forEach(task => (newTasks[task._id] = task));
        const newState = {
          ...this.state,
          tasks: {
            ...newTasks
          }
        };
        this.setState(newState);
      })
      .catch(err => console.log(err));
  };

  reorderTasks = (newState, startColumn, endColumn=undefined) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    const startData = {
      _id: startColumn._id,
      title: startColumn.title,
      taskIds: startColumn.taskIds
    };
    if (!endColumn) {
      axios
      .patch(`${process.env.REACT_APP_API_URI}/boards/columns`, startData, { headers: headers })
      .then(res => {
      })
      .catch(err => console.log(err));
      this.setState(newState);
    } else {
      const endData = {
        _id: endColumn._id,
        title: endColumn.title,
        taskIds: endColumn.taskIds
      }
      axios
      .patch(`${process.env.REACT_APP_API_URI}/boards/columns`, { startData: startData, endData: endData }, { headers })
      .then(res => { console.log(res)})
      .catch(err => console.log(err))
      this.setState(newState)
    }
  };

  reorderColumns = (newState, newBoard) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    const data = {
      columnIds: newBoard.columnIds,
      _id: newBoard._id
    }
    axios.patch(`${process.env.REACT_APP_API_URI}/boards`, data, { headers })
    .then(res => {
      console.log(res)
    })
    .catch(err => console.log(err))
    this.setState(newState);
  }

  setUserAccount = accountInfo => {
    this.setState({ account: accountInfo });
  };

  clearColumnsAndTasks = () => {
    this.setState({ columns: undefined, tasks: undefined });
  };

  removeAccount = () => {
    this.setState({...initialData})
  }

  render() {
    console.log(`app.js: `, this.state);
    return (
      <>
        <Header boards={this.state.boards} token={this.state.account.token} removeAccount={() => this.removeAccount()} />
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Login setUserAccount={this.setUserAccount} />}
          />
          <Route
            path="/signup"
            render={props => <SignUp setUserAccount={this.setUserAccount} />}
          />
          <Route exact path="/board">
            <Home
              addBoard={this.addBoard}
              boards={this.state.boards}
              boardOrder={this.state.boardOrder}
              clearColumnsAndTasks={this.clearColumnsAndTasks}
            />
          </Route>
          <Route
            path="/board/:boardId"
            render={props => (
              <Board
                reorderColumns={this.reorderColumns}
                reorderTasks={this.reorderTasks}
                boardData={this.state}
                addColumn={this.addColumn}
                addTask={this.addTask}
                token={this.state.account.token}
                getColumns={this.getColumns}
                {...props}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

export default withRouter(App);
