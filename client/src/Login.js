import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

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

const Login = ({ setUserAccount }) => {
    const History = useHistory()
    const [ accountInfo, setAccountInfo ] = useState({
        name: "thomy",
        email: "thomy@domain.com",
        password: "notagoodpw"
    })
    const { name, email, password } = accountInfo;
    const handleOnChange = e => {
        setAccountInfo({...accountInfo, [e.target.name]: e.target.value})
    }

    const handleOnSubmit = e => {
        e.preventDefault()
        axios
            .post(`https://mello-backend.herokuapp.com/users/login`, { 
                "name": name,
                "email": email,
                "password": password
             })
            .then((res) => {
                setUserAccount(res.data)
                window.localStorage.setItem("mello-user", JSON.stringify(res.data.token))
                History.push("/board")
            })
            .catch((e) => console.log(e))
    }

    return (
        <Container>
            <UserInfoForm  header={"Login"} handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} name={name} email={email} password={password} />
            <Link to="/signup">Didn't sign up yet? Click here</Link>
        </Container>
    );
};

export default Login;
