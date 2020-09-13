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

  clearColumnsAndTasks = () => {
    this.setState({ columns: undefined, tasks: undefined });
  };

  render() {
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
