import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
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


const SignUp = ({ setUserAccount }) => {
    const [ accountInfo, setAccountInfo ] = useState({
        name: "",
        email: "",
        password: ""
    })
    const History = useHistory();
    const [ error, setError ] = useState("")

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
                window.localStorage.setItem("mello-user", JSON.stringify(res.data.token))
                setUserAccount(res.data)
                setError("")
                History.push("/board")
            })
            .catch((e) => {
                if (e.response){ setError(e.response.data) }
            })
    }

    return (
        <Container>
            <UserInfoForm header={"Signup"} handleOnSubmit={handleOnSubmit} handleOnChange={handleOnChange} fields={['name', 'email', 'password']} error={error} accountInfo={accountInfo} />
            <Link to="/">Want to login instead? Click here.</Link>
        </Container>
    );
};

export default SignUp;
