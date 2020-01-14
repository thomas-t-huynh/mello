import React from "react";
import TaskList from "./TaskList";
import "../css/styles.css";

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
