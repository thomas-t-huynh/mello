import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin: 8px;
  border-radius: 5px;
  width: 150px;
  height: 75px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #1a1a1a;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
  a {
    color: white;
    font-size: 18px;
    font-weight: 600;
    &:hover {
      text-decoration: none;
      color: dodgerblue;
    }
  }
`;

const EditButton = styled.button`
  width: 30px;
  float: right;
  margin-left: 120px;
    background: #1a1a1a;
  opacity: 0.7;
  border: none;
  color: white;
  font-size: 20px;
`;

const TitleInput = styled.textarea`
  width: 95%;
  height: 95%;
  margin: 0 auto;
  resize: none;
  border: none;
  background: #1a1a1a;
  color: white;
      font-size: 18px;
    font-weight: 600;
`;

const BoardTitle = ({
  boards,
  board,
  handleAddBoard,
  boardTitle,
  setBoardTitle,
  preBoard
}) => {
  const [edit, setEdit] = useState(preBoard);

  const checkIfExistingBoard = key => {
    if (board) {
      console.log("yes");
      const editedBoard = {
        _id: boards[board]._id,
        title: boardTitle
      };
      setEdit(false);
      handleAddBoard(key, editedBoard);
    } else {
      handleAddBoard(key);
    }
  };

  const handleSetEdit = () => {
    setBoardTitle(boards[board].title);
    setEdit(true);
  };

  if (edit) {
    return (
      <Container>
        <TitleInput
          autoFocus
          value={boardTitle}
          onChange={e => setBoardTitle(e.target.value)}
          onKeyDown={e => {
            (e.key === "Enter" || e.key === "Escape") &&
              checkIfExistingBoard(e.key);
          }}
        />
      </Container>
    );
  } else {
    return (
      <Container>
        <Link to={`/board/${boards[board]._id}`}>{boards[board].title}</Link>
        <EditButton onClick={() => handleSetEdit()}>...</EditButton>
      </Container>
    );
  }
};

export default BoardTitle;
