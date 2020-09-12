import axios from 'axios'

export const SET_USER = "SET_USER"

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

export const loginUser = (email, password, setError, history) => dispatch => {
    axios
    .post(`${process.env.REACT_APP_API_URI}/users/login`, { 
        "email": email,
        "password": password
     })
    .then((res) => {
        dispatch(setUser(res.data))
        setError("")
        window.localStorage.setItem("mello-user", JSON.stringify(res.data.token))
        history.push("/board")
    })
    .catch((e) => {
        if (e.response){ setError(e.response.data) }
    })
}

export const loginMe = (token, history) => {
    return dispatch => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: token
        };
        axios
        .get(`${process.env.REACT_APP_API_URI}/users/me`, { headers })
        .then(res => {
            // if (history.location.pathname === "/") {
            //     history.push('/board')
            // }
            dispatch(setUser({ ...res.data, token }))
        })
        .catch(err => console.log(err));
    }
}

