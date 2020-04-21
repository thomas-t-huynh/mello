import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 5px;
  width: 150px;
  height: 75px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #d9d9d9;
  color: #808080;
  &:hover {
    background: #e6e6e6;
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
