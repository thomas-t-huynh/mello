import React from "react";
import styled from "styled-components";


const Container = styled.div`
    padding-top: 45px;
`

const UserInfoForm = ({ handleOnSubmit, name, email, password, handleOnChange, header }) => {

    return (
        <Container>
            <form onSubmit={e => handleOnSubmit(e)}>
                <h2>{header}</h2>
                <label>
                    Name:
                    <input type="text" placeholder="Name" value={name} name="name" onChange={e => handleOnChange(e)} />
                </label>
                <label>
                    Email:
                    <input type="email" placeholder="Email" value={email} name="email" onChange={e => handleOnChange(e)} />
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="Password" value={password} name="password" onChange={e => handleOnChange(e)} />
                </label>
                <button>Submit</button>


            </form>
        </Container>
    );
};

export default UserInfoForm;
