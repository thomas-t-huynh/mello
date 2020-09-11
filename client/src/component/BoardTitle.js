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
  let rel = {}
  const checkIfExistingBoard = key => {
    if (board) {
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
    function outsideClick(e) {
      if (e.clientX > (rel.x + rel.width) || e.clientY > (rel.y + rel.height) || (e.clientX < rel.x || e.clientY < rel.y)) {
        console.log('outside of board')
        checkIfExistingBoard("Escape")
        document.removeEventListener('click', outsideClick)
      }
    }
    document.addEventListener('click', outsideClick)
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
      <Container ref={el => {
        // check if el bc if element is gone, it will not exist.
        if (!el) return
        rel = el.getBoundingClientRect()
      }}>
        <Link to={`/board/${boards[board]._id}`}>{boards[board].title}</Link>
        <EditButton onClick={() => handleSetEdit()}>...</EditButton>
      </Container>
    );
  }
};

export default BoardTitle;
