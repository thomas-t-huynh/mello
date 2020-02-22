import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 150px;
  height: 75px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    background: lightgreen;
  }
`;

const EditButton = styled.button`
  width: 30px;
  float: right;
  margin-left: 120px;
`;

const TitleInput = styled.textarea`
  width: 95%;
  height: 95%;
  margin: 0 auto;
  resize: none;
  border: none;
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
        id: boards[board].id,
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
        <Link to={`/board/${boards[board].id}`}>{boards[board].title}</Link>
        <EditButton onClick={() => handleSetEdit()}>...</EditButton>
      </Container>
    );
  }
};

export default BoardTitle;
