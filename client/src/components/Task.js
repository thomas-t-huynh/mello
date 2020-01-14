import React from "react";

import "../css/styles.css";

export const Task = ({ description, id, listTitle, onTaskDrop }) => {
  const onDragStart = (e, id) => {
    e.dataTransfer.setData("id", id);
  };

  return (
    <div
      onDragStart={e => onDragStart(e, id)}
      draggable
      className="task-div"
      onDragEnd={e => onTaskDrop()}
    >
      <p>{description}</p>
    </div>
  );
};

export default Task;
