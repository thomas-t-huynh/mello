import React from "react";
import TaskList from "./TaskList";
import "../css/index.css";

export const Incomplete = ({ taskList, setTaskList }) => {
  return (
    <TaskList
      taskList={taskList}
      listTitle={"Incomplete"}
      setTaskList={setTaskList}
    />
  );
};

export default Incomplete;
