import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding-top: 45px;
  color: white;
  background: #1a1a1a;
  margin-top: 10%;
  margin-bottom: 20px;
  height: 250px;
  border-radius: 20px;
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 500px;
    h2 {
      color: white;
      font-weight: 700;
    }
    label {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      width: 250px;
    }
    input {
      border-radius: 5px;
    } 
    button {
      margin: 20px 0;
      width: 75px;
      background: dodgerblue;
      border: none;
      color: white;
      font-weight: 600;
      padding: 10px 0;
      border-radius: 5px;
      opacity: 0.7;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
`;

const UserInfoForm = ({
  handleOnSubmit,
  name,
  email,
  password,
  handleOnChange,
  header
}) => {
  return (
    <Container>
      <form onSubmit={e => handleOnSubmit(e)}>
        <h2>{header}</h2>
        <label>
          Name:
          <input
            type="text"
            placeholder="Name"
            value={name}
            name="name"
            onChange={e => handleOnChange(e)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={e => handleOnChange(e)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            placeholder="Password"
            value={password}
            name="password"
            onChange={e => handleOnChange(e)}
          />
        </label>
        <button>Submit</button>
      </form>
    </Container>
  );
};

export default UserInfoForm;
