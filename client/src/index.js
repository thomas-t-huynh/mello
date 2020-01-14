import React from "react";
import ReactDOM from "react-dom";
import testTasks from "./testTasks";
import "./css/styles.css";
import Complete from "./components/Complete";
import Incomplete from "./components/Incomplete";

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
    this.forceUpdate();
  }
  render() {
    return (
      <div className="App">
        <Incomplete
          taskList={this.state.taskList}
          setTaskList={this.setTaskList}
        />
        <Complete
          taskList={this.state.taskList}
          setTaskList={this.setTaskList}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
