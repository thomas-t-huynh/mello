import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";

import UserInfoForm from "./component/UserInfoForm";


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
            .post(`http://localhost:3001/users/login`, { 
                "name": name,
                "email": email,
                "password": password
             })
            .then((res) => {
                console.log('LOGGED IN')
                setUserAccount(res.data)
                History.push("/board")
            })
            .catch((e) => console.log(e))
    }

    return (
        <div>
            <UserInfoForm  header={"Login"} handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} name={name} email={email} password={password} />
            <Link to="/signup">Didn't sign up yet? Click here</Link>
        </div>
    );
};

export default Login;
