import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import { Link } from "react-router-dom";

const Container = styled.div`
    padding-top: 45px;
`

const Login = () => {
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
            .post(`http://localhost:3001/users`, { 
                "name": name,
                "email": email,
                "password": password
             })
            .then((res) => console.log(res))
            .catch((e) => console.log(e))
    }

    return (
        <Container>
            <form onSubmit={e => handleOnSubmit(e)}>
                <h2>Signup by filling out the following fields:</h2>
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

export default Login;
