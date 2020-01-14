import React from "react";
import TaskList from "./TaskList";
import "../css/index.css";

export const Complete = ({ taskList, setTaskList }) => {
  return (
    <TaskList
      taskList={taskList}
      listTitle={"Complete"}
      setTaskList={setTaskList}
    />
  );
};

export default Complete;
