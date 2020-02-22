import React from "react";
import styled from "styled-components";
import Task from "./Task";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 220px;
  height: 100%;
`;
const Title = styled.h3`
  padding: 8px;
  cursor: pointer;
`;
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.3s ease;
  background-color: ${props => (props.isDraggingOver ? "skyblue" : "white ")};
`;

const TitleInput = styled.textarea`
  width: 95%;
  height: 95%;
  margin: 0 auto;
  resize: none;
  border: none;
`;

export default class Column extends React.Component {
  state = {
    edit: this.props.preColumn
  };

  checkIfColumnExists = keyValue => {
    if (keyValue === "Enter") {
      if (this.props.column) {
        this.props.handleAddColumn(this.props.column.id);
        this.setState({ edit: false });
      } else {
        this.props.handleAddColumn();
      }
    }
  };

  handleSetEdit = () => {
    const originalTitle = {
      target: {
        value: this.props.column.title
      }
    };
    this.props.setColumnTitle(originalTitle);
    this.setState({ edit: true });
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
        </Container>
      );
    } else {
      return (
        <Container>
          <Title onClick={() => this.handleSetEdit()}>
            {this.props.column.title}
          </Title>
          <Droppable
            droppableId={this.props.column.id}
            // type={this.props.column.id === "column-3" ? "done" : "active"}
            // isDropDisabled={this.props.isDropDisabled}
          >
            {(provided, snapshot) => (
              <TaskList
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {this.props.tasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </TaskList>
            )}
          </Droppable>
          <button onClick={() => this.props.addTask(this.props.column.id)}>
            +
          </button>
        </Container>
      );
    }
  }
}
