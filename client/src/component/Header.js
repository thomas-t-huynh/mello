import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  background: black;
  color: white;
  padding: 5px 0;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;

  a {
    text-decoration: none;
  }
`;

const AppTitle = styled.div`
  opacity: 1;
  margin: 0 auto;
  img {
    filter: invert(100%);
  }
  h1 {
    color: white;
    display: inline;
    font-weight: 400;
    font-family: "Knewave";
    margin-left: 10px;
  }
`;

const HomeButton = styled.button`
  cursor: pointer;
  height: 100%;
  border: none;
  background: #262626;
  opacity: 0.7;
  color: white;
  font-weight: 600;
  padding: 7px 10px;
  border-radius: 5px;
  margin-left: 5px;
  display: flex;
  align-items: center;

  img {
    height: 20px;
    margin-right: 10px;
  }
  &:hover {
    opacity: 1;
  }
`;

const Header = () => {
  return (
    <Container>
      <Link to="/">
        <HomeButton>
          <img src={require("../images/home.png")} />
          Home
        </HomeButton>
      </Link>
      <AppTitle>
        <img src={require("../images/marshmallow.png")} />
        <h1>Mello</h1>
      </AppTitle>
    </Container>
  );
};

export default Header;
