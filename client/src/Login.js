import React, { useState } from "react";
import styled from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

import UserInfoForm from "./component/UserInfoForm";
import { loginUser } from "./actions/users"

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

const Login = ({ loginUser }) => {
    const History = useHistory()
    const [ accountInfo, setAccountInfo ] = useState({
        email: "",
        password: ""
    })
    const [ error, setError ] = useState("")
    const { email, password } = accountInfo;

    const handleOnChange = e => {
        setAccountInfo({...accountInfo, [e.target.name]: e.target.value})
    }

    const handleOnSubmit = e => {
        e.preventDefault()
        loginUser(email, password, setError, History)
    }

    return (
        <Container>
            <UserInfoForm  
                header={"Login"} 
                handleOnSubmit={handleOnSubmit} 
                handleOnChange={handleOnChange} 
                fields={[['email','email'], ['password','password']]} 
                error={error} 
                accountInfo={accountInfo} 
            />
            <Link to="/signup">Didn't sign up yet? Click here</Link>
        </Container>
    );
};

export default connect(undefined, { loginUser })(Login);
