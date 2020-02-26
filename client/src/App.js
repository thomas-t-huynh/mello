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

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = {
    ...initialData,
    account: {}
  }

  addBoard = (title, editedBoard = undefined) => {
    if (editedBoard) {
      let editedState = this.state;
      editedState.boards[editedBoard.id].title = editedBoard.title;
      this.setState(editedState);
    } else {
      const boardCount = this.state.boardsNo + 1;
      const newBoardOrder = [...this.state.boardOrder, `board-${boardCount}`];
      const newState = {
        ...this.state,
        boards: {
          ...this.state.boards,
          [`board-${boardCount}`]: {
            id: `board-${boardCount}`,
            title: title,
            columnsIds: []
          }
        },
        boardOrder: newBoardOrder,
        boardsNo: this.state.boardsNo + 1
      };
      this.setState(newState);
      console.log(newState);
    }

    // console.log(...this.state.boards);
  };

  addColumn = (boardId, columnTitle, columnId = undefined) => {
    if (columnId) {
      let editedState = this.state;
      editedState.columns[columnId].title = columnTitle;
      this.setState(editedState);
      return;
    }
    const columnCount = this.state.columnsNo + 1;
    const newColumn = `column-${columnCount}`;
    const newColumnsId = [...this.state.boards[boardId].columnsIds, newColumn];

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newColumn]: {
          id: newColumn,
          title: columnTitle,
          taskIds: []
        }
      },
      boards: {
        ...this.state.boards,
        [boardId]: {
          ...this.state.boards[boardId],
          columnsIds: newColumnsId
        }
      },
      columnsNo: columnCount
    };

    this.setState(newState);
    console.log(this.state);
  };

  addTask = (columnId, taskDescription, taskId = undefined) => {
    console.log(taskId);
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
    console.log(newState);
    this.setState(newState);
  };

  reorderTasks = newState => {
    this.setState(newState);
  };

  setUserAccount = (accountInfo) => {
    this.setState({ account: accountInfo })
  }

  render() {
    console.log(this.state.account)
    return (
      <Router>
        <Header />
        <Switch>
          <Route exact path="/" render={props => <Login setUserAccount={this.setUserAccount} />} />
          <Route path="/signup" render={props => <SignUp setUserAccount={this.setUserAccount} />} />
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
                initialData={this.state}
                addColumn={this.addColumn}
                addTask={this.addTask}
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
