import React from "react";
import Draggable from "./Draggable";
import "../css/index.css";

export const Task = ({ description, id, listTitle, onTaskDrop }) => {
  
  const onDragStart = () => {
    let e = new DataTransfer()
    console.log(e)
    e["effectAllowed"] = "uninitialized"
    e.setData("id", id)
    
  };

  return (
    <Draggable
      onDragStart={onDragStart}
      draggable
    >
      <div
        

        className="task-div"
        onDragEnd={e => onTaskDrop()}
      >
        <p>{description}</p>
      </div>
    </Draggable>
  );
};

export default Task;
