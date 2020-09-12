import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
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

const Login = ({ setUserAccount, loginUser }) => {
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
        // axios
        //     .post(`${process.env.REACT_APP_API_URI}/users/login`, { 
        //         "email": email,
        //         "password": password
        //      })
        //     .then((res) => {
        //         setUserAccount(res.data)
        //         setError("")
        //         window.localStorage.setItem("mello-user", JSON.stringify(res.data.token))
        //         History.push("/board")
        //     })
        //     .catch((e) => {
        //         if (e.response){ setError(e.response.data) }
        //     })
        loginUser(email, password, setError, History)
    }

    return (
        <Container>
            <UserInfoForm  header={"Login"} handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} fields={['email', 'password']} error={error} accountInfo={accountInfo} />
            <Link to="/signup">Didn't sign up yet? Click here</Link>
        </Container>
    );
};

export default connect(undefined, { loginUser })(Login);
