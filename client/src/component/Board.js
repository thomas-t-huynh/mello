import React from "react";
import "@atlaskit/css-reset";
import styled from "styled-components";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { useParams } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  display: flex;
  padding-top: 45px;
`;

const AddColumnButton = styled.button`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  min-width: 250px;
  height: 100%;
  background: #d9d9d9;
  border: none;
  color: #808080;
  padding: 10px;
  display: flex;
  align-items: center;
  &:hover {
    background: #e6e6e6;
  }
  cursor: pointer;
  span {
    font-size: 20px;
    margin-right: 5px;
  }
`;

class Board extends React.Component {
  state = {
    preColumn: false,
    columnTitle: ""
  };
  // onDragStart = start => {
  //   const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

  //   this.setState({
  //     homeIndex
  //   });
  // };

  // onDragStart = () => {
  //   document.body.style.color = "orange";
  //   document.body.style.transition = "background-color 0.2s ease";
  // };

  // onDragUpdate = update => {
  //   const { destination } = update;

  //   const opacity = destination
  //     ? destination.index / Object.keys(this.state.tasks).length
  //     : 0;
  //   document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
  // };
  componentDidMount() {
    if (this.props.boardData.columnIds) {
      const headers = {
        "Content-Type": "application/json",
        Authorization: this.props.token
      };
      const columnIds = this.props.boardData.columnIds.join("");
      console.log(columnIds);
      axios
        .get(
          "/boards/:boardId/columns",
          { columnIds: columnIds },
          { headers: headers }
        )
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }
  }

  onDragEnd = result => {
    // this.setState({
    //   homeIndex: null
    // });
    const { columns } = this.props.initialData;
    document.body.style.color = "inherit";
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.props.initialData,
        columns: {
          ...this.props.initialData.columns,
          [newColumn.id]: newColumn
        }
      };
      console.log(newState);
      this.props.reorderTasks(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.props.initialData,
      columns: {
        ...this.props.initialData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    this.props.reorderTasks(newState);
  };

  setColumnTitle = e => {
    this.setState({ columnTitle: e.target.value });
  };

  handleAddColumn = (columnId = undefined, keyValue) => {
    if (keyValue === "Enter") {
      this.props.addColumn(
        this.props.match.params.boardId,
        this.state.columnTitle,
        columnId
      );
    }
    this.setState({
      preColumn: false,
      columnTitle: ""
    });
  };

  render() {
    const boardId = this.props.match.params.boardId;
    const { boards, columns, tasks } = this.props.boardData;
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        // onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {boards[boardId].columnIds &&
            boards[boardId].columnIds.map((columnId, index) => {
              const column = columns[columnId];
              const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
              // const isDropDisabled = index < this.state.homeIndex;
              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  addTask={this.props.addTask}
                  columnTitle={this.state.columnTitle}
                  setColumnTitle={this.setColumnTitle}
                  handleAddColumn={this.handleAddColumn}
                  // isDropDisabled={isDropDisabled}
                />
              );
            })}
          {this.state.preColumn ? (
            <Column
              preColumn={this.state.preColumn}
              columnTitle={this.state.columnTitle}
              setColumnTitle={this.setColumnTitle}
              handleAddColumn={this.handleAddColumn}
            />
          ) : null}
          <AddColumnButton onClick={() => this.setState({ preColumn: true })}>
            <span>+</span>Add a column
          </AddColumnButton>
        </Container>
      </DragDropContext>
    );
  }
}

export default Board;
