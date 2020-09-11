import React from "react";
import styled from "styled-components";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  min-width: 250px;
  max-width: 250px;
  height: 100%;
  background: #d9d9d9;
`;

const Title = styled.h3`
  padding: 8px;
  cursor: pointer;
  color: #1a1a1a;
`;

const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.3s ease;
  background: #d9d9d9;
  /* background-color: ${props =>
    props.isDraggingOver ? "skyblue" : "#cccccc"}; */
`;

const TitleInput = styled.input`
  border: none;
  font-size: 18.72px;
  padding: 8px;
`;

const Button = styled.button`
  background: #d9d9d9;
  border: none;
  color: #808080;
  padding: 8px;
  margin: 0 auto 8px auto;
  display: flex;
  align-items: center;
  width: 95%;
  border-radius: 5px;
  &:hover {
    background: #e6e6e6;
  }
  cursor: pointer;
  span {
    font-size: 20px;
    margin-right: 5px;
  }
`;

export default class Column extends React.Component {
  state = {
    edit: this.props.preColumn,
    preTask: false,
    taskDescription: "",
    rel: React.createRef()
  };

  checkIfColumnExists = keyValue => {
    if (this.props.column) {
      this.props.handleAddColumn(this.props.column._id, keyValue);
      this.setState({ edit: false });
    } else {
      this.props.handleAddColumn(undefined, keyValue);
    }
  };

  handleSetEdit = () => {
    const originalTitle = {
      target: {
        value: this.props.column.title
      }
    };
    this.props.setColumnTitle(originalTitle);
    const rel = this.state.rel.current.getBoundingClientRect()
    const outsideClick = (e) => {
      if (e.clientX > (rel.x + rel.width) || e.clientY > (rel.y + rel.height) || (e.clientX < rel.x || e.clientY < rel.y)) {
        console.log('outside of board')
        this.props.setColumnTitle(originalTitle)
        this.setState({ edit: false })
        document.removeEventListener('click', outsideClick)
      }
    }
    document.addEventListener('click', outsideClick)
    this.setState({ edit: true });
  };

  setTaskDescription = e => {
    this.setState({ taskDescription: e.target.value });
  };

  handleAddTask = (taskId = undefined, keyValue) => {
    if (keyValue === "Enter") {
      this.props.addTask(
        this.props.boardId,
        this.props.column._id,
        this.state.taskDescription,
        taskId
      );
    }
    this.setState({ preTask: false, taskDescription: "" });
  };

  renderTaskList = () => {
    return (
        <div>
          <Droppable
            droppableId={this.props.column._id}
          >
            {(provided, snapshot) => (
              <TaskList
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {this.props.tasks.map((task, index) => (
                  <Task
                    key={task._id}
                    task={task}
                    index={index}
                    preTask={this.state.preTask}
                    taskDescription={this.state.taskDescription}
                    setTaskDescription={this.setTaskDescription}
                    handleAddTask={this.handleAddTask}
                  />
                ))}
                {provided.placeholder}
                {this.state.preTask && (
                  <Task
                    preTask={this.state.preTask}
                    taskDescription={this.state.taskDescription}
                    setTaskDescription={this.setTaskDescription}
                    handleAddTask={this.handleAddTask}
                  />
                )}
              </TaskList>
            )}
          </Droppable>
          <Button onClick={() => this.setState({ preTask: true })}>
            <span>+</span>Add another card
          </Button>
        </div>
    );
  };

  render() {
    if (this.state.edit) {
      return (
        <Container>
          <TitleInput
            autoFocus
            value={this.props.columnTitle}
            onChange={e => this.props.setColumnTitle(e)}
            onKeyDown={e => {
              (e.key === "Enter" || e.key === "Escape") &&
                this.checkIfColumnExists(e.key);
            }}
          />
          {!this.props.preColumn && this.renderTaskList()}
        </Container>
      );
    } else {
      return (
        <Draggable
          draggableId={this.props.column._id}
          index={this.props.index}
        >
          {(provided, snapshot) => (
            <Container
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            >
              <Title ref={this.state.rel} onClick={() => this.handleSetEdit()}>
                {this.props.column.title}
              </Title>
              {this.renderTaskList()}
            </Container>
          )}
        </Draggable>
      );
    }
  }
}
