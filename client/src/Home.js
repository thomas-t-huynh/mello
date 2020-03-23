import React, { useState } from "react";
import styled from "styled-components";
import BoardTitle from "./component/BoardTitle";
import { Link } from "react-router-dom";

const AddBoardButton = styled.button`
  height: 20px;
`;

const HomeContainer = styled.div`
  display: flex;
  align-items: center;
  padding-top: 45px;
`;

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 150px;
  height: 75px;
  padding: 5px;
  &:hover {
    background: lightgreen;
  }
`;

const Home = ({ boardOrder, boards, addBoard }) => {
  const [preBoard, setPreBoard] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");

  const handleAddBoard = (keyValue, editedBoard) => {
    if (keyValue === "Enter") {
      addBoard(boardTitle, editedBoard);
    }
    setPreBoard(false);
    setBoardTitle("");
  };

  return (
    <HomeContainer>
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
      <AddBoardButton onClick={() => setPreBoard(true)}>+</AddBoardButton>
    </HomeContainer>
  );
};

export default Home;
