import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border-bottom: 1px solid darkgray;
  border-right: 1px solid darkgray;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 8px;
  background: #f2f2f2;
  /* background-color: ${props =>
    props.isDragDisabled
      ? "lightgray"
      : props.isDragging
      ? "lightgreen"
      : "white"}; */
  display: flex;
  &:hover {
    background: #e6e6e6;
  }
  div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    &:hover {
      img {
        visibility: visible;
        cursor: pointer;
      }
    }
    p {
      width: 90%;
      color: black;
      display: inline;
    }
  }
`;

const TaskInput = styled.textarea`
  width: 95%;
  height: 95%;
  margin: 0 auto;
  overflow: auto;
  resize: none;
  border: none;
  font-size: 16px;
  &:focus {
    background: #f2f2f2;
  }
  &:hover {
    background: #e6e6e6;
  }
`;

const Icon = styled.img`
  width: 15px;
  height: 15px;
  visibility: hidden;
`;

// const Handle = styled.div`
//   width: 20px;
//   height: 20px;
//   background-color: orange;
//   border-radius: 4px;
//   margin-right: 8px;
// `;

export default class Task extends React.Component {
  state = {
    edit: this.props.preTask,
    rel: React.createRef()
  };

  checkIfTaskExists = keyValue => {
    if (this.props.task) {
      this.props.handleAddTask(this.props.task._id, keyValue);
      this.setState({ edit: false });
    } else {
      this.props.handleAddTask(undefined, keyValue);
    }
  };

  handleSetEdit = () => {
    const originalDescription = {
      target: {
        value: this.props.task.content
      }
    };
    const rel = this.state.rel.current.getBoundingClientRect()
    console.log(rel)
    const outsideClick = (e) => {
      if (e.clientX > (rel.x + rel.width) || e.clientY > (rel.y + rel.height * 2) || (e.clientX < rel.x || e.clientY < rel.y)) {
        this.props.setTaskDescription(originalDescription);
        this.setState({ edit: false })
        document.removeEventListener('click', outsideClick)
      }
    }
    document.addEventListener('click', outsideClick)
    this.props.setTaskDescription(originalDescription);
    this.setState({ edit: true });
  };

  render() {
    // const isDragDisabled = this.props.task.id === "task-1";
    if (this.state.edit) {
      return (
        <Container>
          <TaskInput
            autoFocus
            value={this.props.taskDescription}
            onChange={e => this.props.setTaskDescription(e)}
            onKeyDown={e =>
              (e.key === "Enter" || e.key === "Escape") &&
              this.checkIfTaskExists(e.key)
            }
          />
        </Container>
      );
    } else {
      return (
        <Draggable
          draggableId={this.props.task._id}
          index={this.props.index}
        >
          {(provided, snapshot) => (
            <Container
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            >
              <div ref={this.state.rel}>
                <p>{this.props.task.content}</p>
                <Icon
                  onClick={() => this.handleSetEdit()}
                  src="https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_mode_edit_48px-512.png"
                />
              </div>
            </Container>
          )}
        </Draggable>
      );
    }
  }
}
