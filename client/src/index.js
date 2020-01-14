import React from "react";
import ReactDOM from "react-dom";
import testTasks from "./testTasks";
import "./css/index.css";
import Complete from "./components/Complete";
import Incomplete from "./components/Incomplete";
import TaskHeader from "./components/TaskHeader";
import Header from "./components/Header";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskList: testTasks
    };
    this.setTaskList = this.setTaskList.bind(this);
  }

  setTaskList(taskList) {
    this.setState({ taskList: taskList });

  }
  render() {
    return (
      <div className="App">
        <Header />
        <TaskHeader />
        <div className="App-lists-div">
          <Incomplete
            taskList={this.state.taskList}
            setTaskList={this.setTaskList}
          />
          <Complete
            taskList={this.state.taskList}
            setTaskList={this.setTaskList}
          />
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
