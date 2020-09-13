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
      align-items: center;
    }
    input {
      border-radius: 5px;
      max-height: 15px;
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
  accountInfo,
  error
}) => {
  return (
    <Container>
      <form onSubmit={e => handleOnSubmit(e)}>
        <h2>{header}</h2>
        <ErrorMessage>{error}</ErrorMessage>
        {fields.map(([fieldName, fieldType], i) => (
          <label key={i}>
            {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:
            <input
              type={fieldType}
              placeholder={fieldName}
              value={accountInfo[fieldName]}
              name={fieldName}
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
