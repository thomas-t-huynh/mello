import React, { useState } from "react";
import axios from "axios";


const Register = () => {


    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(username, email, password)
        axios.post("http://localhost:3001/users", {
            name: username,
            email: email,
            password: password
        })
        .then((res) => {
            console.log(res)
            // store token into user's cache ( or some kind of storage on client's side that persists after leaving website )
            // have index load either register.js or app.js based on some conditionals before component mounts
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return (
        <div>
            <form onSubmit={e => handleSubmit(e)}>
                <p>Username</p>
                <input id="username" onChange={e => setUsername(e.target.value)} />
                <p>Email</p>
                <input id="email" onChange={e => setEmail(e.target.value)} />
                <p>Password</p>
                <input id="password" type="password" onChange={e => setPassword(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
};


export default Register;
