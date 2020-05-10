import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 40px 0 20px 0 ;
  color: white;
  background: #1a1a1a;
  margin-top: 10%;
  margin-bottom: 20px;
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

const ErrorMessage = styled.p`
  color: yellow;
`

const UserInfoForm = ({
  handleOnSubmit,
  fields,
  handleOnChange,
  header,
  accountInfo
}) => {
  return (
    <Container>
      <form onSubmit={e => handleOnSubmit(e)}>
        <h2>{header}</h2>
        <ErrorMessage></ErrorMessage>
        {fields.map((field, i) => (
          <label key={i}>
            {field.charAt(0).toUpperCase() + field.slice(1)}:
            <input
              type="text"
              placeholder={field}
              value={accountInfo[field]}
              name={field}
              onChange={e => handleOnChange(e)}
            />
          </label>
        ))}
        <button>Submit</button>
      </form>
    </Container>
  );
};

export default UserInfoForm;
