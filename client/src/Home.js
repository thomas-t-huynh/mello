import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BoardTitle from "./component/BoardTitle";

const Container = styled.div`
  display: flex;
  align-items: center;
  padding-top: 45px;
`;


const LoadingImg = styled.img`
    margin: 50px auto;
`
const AddBoardButton = styled.div`
  margin: 8px;
  border-radius: 5px;
  width: 120px;
  height: 30px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: dodgerblue;
  opacity: 0.7;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
  p {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
`;

const Home = ({ boardOrder, boards, addBoard, clearColumnsAndTasks }) => {
  const [preBoard, setPreBoard] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  useEffect(() => {
    clearColumnsAndTasks();
  }, [])

  const handleAddBoard = (keyValue, editedBoard) => {
    if (keyValue === "Enter") {
      addBoard(boardTitle, editedBoard);
    }
    setPreBoard(false);
    setBoardTitle("");
  };

  return (
    <Container>
    {!boardOrder && <LoadingImg src={require("./assets/loading.gif")}/>}
      {boardOrder && boardOrder.map(board => {
        return (
          <BoardTitle
            key={boards[board]._id}
            setBoardTitle={setBoardTitle}
            handleAddBoard={handleAddBoard}
            board={board}
            boards={boards}
            boardTitle={boardTitle}
          />
        );
      })}
      {preBoard ? (
        <BoardTitle
          preBoard={preBoard}
          handleAddBoard={handleAddBoard}
          setBoardTitle={setBoardTitle}
        />
      ) : null}
      <AddBoardButton onClick={() => setPreBoard(true)}>
        <p>+ Add Board</p>
      </AddBoardButton>
    </Container>
  );
};

export default Home;
