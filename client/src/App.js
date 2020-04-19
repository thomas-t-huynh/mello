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
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = {
    ...initialData
  };

  componentDidMount() {
    const melloUser = window.localStorage.getItem("mello-user");
    if (melloUser) {
      this.setState({ account: JSON.parse(melloUser) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.account !== this.state.account) {
      this.getBoards();
    }
  }

  getBoards = () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    // console.log('fetching boards....')
    axios
      .get(`http://localhost:3001/boards`, {
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
        .get(`http://localhost:3001/boards/${boardId}/columns`, {
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
        });
    }
  };
  addBoard = (title, editedBoard = undefined) => {
    if (editedBoard) {
      let editedState = this.state;
      editedState.boards[editedBoard.id].title = editedBoard.title;
      this.setState(editedState);
    } else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: this.state.account.token
      };

      axios
        .post(
          `http://localhost:3001/boards`,
          { title: title },
          {
            headers: headers
          }
        )
        .then(res => {
          const { id } = res.data.board;
          const newBoardOrder = [...this.state.boardOrder, `board-${id}`];
          const newState = {
            ...this.state,
            boards: {
              ...this.state.boards,
              [`board-${id}`]: {
                id: `board-${id}`,
                title: title,
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
    if (columnId) {
      let editedState = this.state;
      editedState.columns[columnId].title = columnTitle;
      this.setState(editedState);
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };
    axios
      .post(
        `http://localhost:3001/boards/${boardId}/columns`,
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

  addTask = (columnId, taskDescription, taskId = undefined) => {
    if (taskId) {
      const editedState = this.state;
      editedState.tasks[taskId].content = taskDescription;
      this.setState(editedState);
      return;
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.state.account.token
    };

    const data = {
      content: taskDescription
    }
    console.log(columnId, taskDescription)
    axios
      .post(`http://localhost:3001/boards/columns/${columnId}/tasks`, data, { headers: headers })
      .then(res => {
        console.log(res)
      })
      .catch(err => console.log(err));
    // const tasksCount = this.state.tasksNo + 1;
    // const newTask = `task-${tasksCount}`;
    // const newTaskIds = [...this.state.columns[columnId].taskIds, newTask];

    // const newState = {
    //   ...this.state,
    //   tasks: {
    //     ...this.state.tasks,
    //     [newTask]: { id: newTask, content: taskDescription }
    //   },
    //   columns: {
    //     ...this.state.columns,
    //     [columnId]: {
    //       ...this.state.columns[columnId],
    //       taskIds: newTaskIds
    //     }
    //   },
    //   tasksNo: tasksCount
    // };
    // this.setState({});
  };

  reorderTasks = newState => {
    this.setState(newState);
  };

  setUserAccount = accountInfo => {
    this.setState({ account: accountInfo });
  };

  clearColumnsAndTasks = () => {
    this.setState({ columns: undefined, tasks: undefined });
  };

  render() {
    console.log(`app,js`, this.state);
    return (
      <Router>
        <Header />
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
      </Router>
    );
  }
}

export default App;
