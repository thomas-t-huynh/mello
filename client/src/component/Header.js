import React from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

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

const Button = styled.button`
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

const LogoutButton = styled(Button)`
  margin-right: 5px;
  margin-left: 0;
`;


const Header = ({ boards, token, removeAccount }) => {
  const History = useHistory()
  const handleLogout = () => {
    const headers = {
      "Content-Type": "application/json",
      "Authorization": token
    };
    axios.post(`${process.env.REACT_APP_API_URI}/users/logoutAll`, undefined, { headers })
    .then(res => {
      History.push("/")
      removeAccount()
      window.localStorage.removeItem("mello-user")
    })
    .catch(err => console.log(err))
  }


  return (
    <Container>
      {boards && (
      <Link to="/board">
        <Button>
          <img src={require("../images/home.png")} />
          Home
        </Button>
      </Link>
      )}
      <AppTitle>
        <img src={require("../images/marshmallow.png")} />
        <h1>Mello</h1>
      </AppTitle>
      {boards && (
        <Link to="/" onClick={() => handleLogout()}>
          <LogoutButton>Logout</LogoutButton>
        </Link>
      )}
    </Container>
  );
};

export default Header;
