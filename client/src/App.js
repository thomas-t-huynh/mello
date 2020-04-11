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
    ...initialData,
    account: {}
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.account !== this.state.account) {
      this.getBoards();
    }
  }
  getBoards = () => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": this.state.account.token
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
      //     const newBoardOrder = [...this.state.boardOrder, `board-${boardCount}`];
      //     const newState = {
      //       ...this.state,
      //       boards: {
      //       ...this.state.boards,
      //       [`board-${boardCount}`]: {
      //         id: `board-${boardCount}`,
      //         title: title,
      //         columnsIds: []
      //       }
      //     },
      //     boardOrder: newBoardOrder,
      //   };
      //   this.setState(newState);
      //   console.log(newState);
      // }

      // console.log(...this.state.boards);
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
      .then(res => console.log(res))
      .catch(err => console.log(err));

    // const columnCount = this.state.columnsNo + 1;
    // const newColumn = `column-${columnCount}`;
    // const newColumnsId = [...this.state.boards[boardId].columnsIds, newColumn];

    // const newState = {
    //   ...this.state,
    //   columns: {
    //     ...this.state.columns,
    //     [newColumn]: {
    //       id: newColumn,
    //       title: columnTitle,
    //       taskIds: []
    //     }
    //   },
    //   boards: {
    //     ...this.state.boards,
    //     [boardId]: {
    //       ...this.state.boards[boardId],
    //       columnsIds: newColumnsId
    //     }
    //   },
    //   columnsNo: columnCount
    // };

    // this.setState(newState);
  };

  addTask = (columnId, taskDescription, taskId = undefined) => {
    if (taskId) {
      const editedState = this.state;
      editedState.tasks[taskId].content = taskDescription;
      this.setState(editedState);
      return;
    }
    const tasksCount = this.state.tasksNo + 1;
    const newTask = `task-${tasksCount}`;
    const newTaskIds = [...this.state.columns[columnId].taskIds, newTask];

    const newState = {
      ...this.state,
      tasks: {
        ...this.state.tasks,
        [newTask]: { id: newTask, content: taskDescription }
      },
      columns: {
        ...this.state.columns,
        [columnId]: {
          ...this.state.columns[columnId],
          taskIds: newTaskIds
        }
      },
      tasksNo: tasksCount
    };
    this.setState({});
  };

  reorderTasks = newState => {
    this.setState(newState);
  };

  setUserAccount = accountInfo => {
    this.setState({ account: accountInfo });
  };

  render() {
    // console.log(`app,.js`, this.state);
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
