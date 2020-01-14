import React, { useState } from "react";
import Task from "./Task";
import "../css/index.css";

export const TaskList = ({ listTitle, taskList, setTaskList }) => {
  const [list, setList] = useState(
    taskList.filter(task => task.list === listTitle)
  );
  const onDragOver = e => {
    e.preventDefault();
  };
  const onTaskDrop = () => {
    setList(taskList.filter(task => task.list === listTitle));
  };
  const onDrop = (e, info) => {
    let index = taskList.findIndex(
      task => task.id === parseInt(e.dataTransfer.getData("id"))
    );
    let task = taskList.splice(index, 1);
    task[0].list = listTitle;
    taskList.push(task[0]);
    setTaskList(taskList);
    setList(taskList.filter(task => task.list === listTitle));
  };

  return (
    <div
      onDragOver={e => onDragOver(e)}
      className="taskList-div"
      onDrop={e => onDrop(e, "done")}
    >
      <h2>{listTitle}</h2>
      <div className="taskList-list">
        {list.map(task => (
          <Task
            key={task.id}
            id={task.id}
            description={task.description}
            listTitle={task.list}
            onTaskDrop={onTaskDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
