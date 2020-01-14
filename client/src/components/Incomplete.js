import React from "react";
import TaskList from "./TaskList";
import "../css/styles.css";

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
