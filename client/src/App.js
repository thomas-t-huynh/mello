import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import "@atlaskit/css-reset";
import "./styles.css";

import initialData from "./init-data";
import Board from "./component/Board";
import Home from "./Home";
import Header from "./component/Header";
import Login from "./Login";
import SignUp from "./SignUp";
import { Switch, Route } from "react-router-dom";
import { loginMe } from "./actions/users"
import { getBoards } from "./actions/data"

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
      const { history } = this.props
      this.props.loginMe(token, history)
    }
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.account !== this.props.account) {
      if (Object.keys(this.props.account).length > 0) {
        this.props.getBoards()
      }
    }
  }

  reorderTasks = (newState, startColumn, endColumn=undefined) => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.props.account.token
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
      Authorization: this.props.account.token
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

  clearColumnsAndTasks = () => {
    this.setState({ columns: undefined, tasks: undefined });
  };

  render() {
    // console.log(`app.js: `, this.state);
    // console.log(this.props.account)
    console.log(this.props.data)
    const ifAccount = Object.keys(this.props.account).length > 0
    return (
      <>
        <Header account={ifAccount} />
        <Switch>
          <Route
            exact
            path="/"
            component={Login}
          />
          <Route
            path="/signup"
            component={SignUp}
          />
          <Route exact path="/board">
            <Home
              boards={this.props.boards}
              boardOrder={this.props.boardOrder}
              clearColumnsAndTasks={this.clearColumnsAndTasks}
            />
          </Route>
          <Route
            path="/board/:boardId"
            render={props => (
              <Board
                reorderColumns={this.reorderColumns}
                reorderTasks={this.reorderTasks}
                boardData={this.props}
                token={this.state.account.token}
                getColumnsOld={this.getColumns}
                {...props}
              />
            )}
          />
        </Switch>
      </>
    );
  }
}

const mapStateToProps = state => ({
  account: state.users.account,
  headers: state.users.headers,
  ...state.data,
  data: state.data
})

export default connect(mapStateToProps, { 
  loginMe,
  getBoards
})(App);
