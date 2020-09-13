import React from "react";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { connect } from "react-redux"
import "@atlaskit/css-reset";

import { 
    getColumns, 
    getTasks, 
    addColumn, 
    reorderColumns,
    reorderTasks
} from "../actions/data"
import Column from "./Column";

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

const LoadingImg = styled.img`
    margin: 50px auto;
`

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            preColumn: false,
            columnTitle: "",
            token: ""
        };
    }

    // initialize columns on initial board entry
    componentDidMount() {
        const boardId = this.props.match.params.boardId;
        if (this.props.boardData.boards) {
            this.props.getColumns(boardId)
            this.props.getTasks(boardId)
            // this.props.getColumnsOld(boardId);
        }
    }
    
    // initialize columns on board change or refresh
    componentDidUpdate(prevProps) {
        const boardId = this.props.match.params.boardId;
        if (prevProps.boardData.boards !== this.props.boardData.boards) {
            this.props.getColumns(boardId)
            this.props.getTasks(boardId)
            // this.props.getColumnsOld(boardId);
        }
    }

    onDragEnd = result => {
        const { destination, source, draggableId } = result;
        if (result.type === "column") {
            if (!destination) {
                return;
            }
            if (
                destination.droppableId === source.droppableId &&
                destination.index === source.index
            ) {
                return;
            }
            const newColumnIds = this.props.boardData.boards[destination.droppableId].columnIds
            newColumnIds.splice(source.index, 1)
            newColumnIds.splice(destination.index, 0, { columnId: draggableId })

            const updatedBoard = {
                ...this.props.boardData.boards[destination.droppableId],
                columnIds: newColumnIds
            }
            const updatedData = {
                ...this.props.boardData,
                boards: {
                    ...this.props.boardData.boards,
                    [destination.droppableId]: updatedBoard
                }
            }
            this.props.reorderColumns(updatedData, updatedBoard)
            return
        } 
        const { columns } = this.props.boardData;
        document.body.style.color = "inherit";
        
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
            newTaskIds.splice(destination.index, 0, {taskId: draggableId});

            const updatedColumn = {
                ...start,
                taskIds: newTaskIds
            };

            const updatedData = {
                ...this.props.boardData,
                columns: {
                    ...this.props.boardData.columns,
                    [updatedColumn._id]: updatedColumn
                }
            };
            this.props.reorderTasks(updatedData, updatedColumn);
            return;
        }

        // Moving from one list to another
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const startColumn = {
            ...start,
            taskIds: startTaskIds
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, {taskId: draggableId});
        const endColumn = {
            ...finish,
            taskIds: finishTaskIds
        };

        const updatedData = {
            ...this.props.boardData,
            columns: {
                ...this.props.boardData.columns,
                [startColumn._id]: startColumn,
                [endColumn._id]: endColumn
            }
        };
        this.props.reorderTasks(updatedData, startColumn, endColumn);
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
        if (columns) {
            return (
                <DragDropContext
                    onDragStart={this.onDragStart}
                    onDragEnd={this.onDragEnd}
                >
                    <Droppable droppableId={boardId} direction="horizontal" type="column">
                        {(provided, snapshot) => (
                            <Container
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                isDraggingOver={snapshot.isDraggingOver}
                            >
                                {(boards[boardId].columnIds && tasks) &&
                                    boards[boardId].columnIds.map((columnId, index) => {
                                        const column = columns[columnId.columnId];
                                        const columnTasks = column.taskIds.map(
                                            ({ taskId }, index) => tasks[taskId]
                                        );
                                        return (
                                            <Column
                                                key={column._id}
                                                index={index}
                                                column={column}
                                                tasks={columnTasks}
                                                columnTitle={this.state.columnTitle}
                                                setColumnTitle={this.setColumnTitle}
                                                handleAddColumn={this.handleAddColumn}
                                                boardId={boardId}
                                            />
                                        );
                                    })}
                                {provided.placeholder}
                                {this.state.preColumn ? (
                                    <Column
                                        preColumn={this.state.preColumn}
                                        columnTitle={this.state.columnTitle}
                                        setColumnTitle={this.setColumnTitle}
                                        handleAddColumn={this.handleAddColumn}
                                    />
                                ) : null}
                                <AddColumnButton
                                    onClick={() => this.setState({ preColumn: true })}
                                >
                                    <span>+</span>Add a column
                                </AddColumnButton>
                            </Container>
                        )}
                    </Droppable>
                </DragDropContext>
            );
        } else {
          return <Container><LoadingImg src={require("../assets/loading.gif")}/></Container>
        }
    }
}

export default connect(undefined, { 
    getColumns, 
    getTasks, 
    addColumn, 
    reorderColumns,
    reorderTasks
})(Board);
