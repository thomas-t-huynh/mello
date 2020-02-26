import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory } from "react-router-dom";
import UserInfoForm from "./component/UserInfoForm";

const SignUp = ({ setUserAccount }) => {
    const [ accountInfo, setAccountInfo ] = useState({
        name: "thomy",
        email: "thomy@domain.com",
        password: "notagoodpw"
    })
    const History = useHistory();
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
            .then((res) => {
                console.log(res.data)
                setUserAccount(res.data)
                History.push("/board")
            })
            .catch((e) => console.log(e))
    }

    return (
        <div>
            <UserInfoForm header={"Signup"} handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} name={name} email={email} password={password} />
        </div>
    );
};

export default SignUp;
