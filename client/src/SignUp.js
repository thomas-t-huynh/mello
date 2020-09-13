import React, { useState } from "react";
import styled from "styled-components";
import { useHistory, Link } from "react-router-dom";
import { connect } from "react-redux";

import { signUpUser } from "./actions/users"
import UserInfoForm from "./component/UserInfoForm";

const Container = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    a {
        color: dodgerblue;
    }
`

const SignUp = ({ signUpUser }) => {
    const [ accountInfo, setAccountInfo ] = useState({
        name: "",
        email: "",
        password: "",
        "confirm password": ""
    })
    const History = useHistory();
    const [ error, setError ] = useState("")

    const handleOnChange = e => {
        setAccountInfo({...accountInfo, [e.target.name]: e.target.value})
    }

    const handleOnSubmit = e => {
        e.preventDefault()
        if (accountInfo.password !== accountInfo["confirm password"]) {
            setError("Password entries do not match")
            return
        }
        signUpUser(accountInfo, History, setError)
    }

    return (
        <Container>
            <UserInfoForm 
                header={"Signup"} 
                handleOnSubmit={handleOnSubmit} 
                handleOnChange={handleOnChange} 
                fields={[
                    ['name', 'name'], 
                    ['email','email'], 
                    ['password','password'], 
                    ['confirm password', 'password']
                ]}
                error={error} 
                accountInfo={accountInfo}
            />
            <Link to="/">Want to login instead? Click here.</Link>
        </Container>
    );
};

export default connect(undefined, { signUpUser })(SignUp);
