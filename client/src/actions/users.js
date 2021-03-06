import axios from 'axios'

export const SET_USER = "SET_USER"
export const REMOVE_USER = "REMOVE_USER"

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

export const removeUser = () => ({
    type: REMOVE_USER
})

export const loginUser = (email, password, setError, history) => dispatch => {
    axios
    .post(`${process.env.REACT_APP_API_URI}/users/login`, { 
        "email": email,
        "password": password
     })
    .then((res) => {
        console.log('actions/users.js',{...res.data.user})
        dispatch(setUser({...res.data.user, token: res.data.token }))
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
            if (history.location.pathname === "/") {
                history.push('/board')
            }
            console.log(res.data)
            dispatch(setUser({ ...res.data, token }))
        })
        .catch(err => console.log(err));
    }
}

export const logoutUser = (history) => (dispatch, getState) => {
    const headers = getState().users.headers
    axios.post(`${process.env.REACT_APP_API_URI}/users/logoutAll`, undefined, { headers })
    .then(res => {
      dispatch(removeUser())
      history.push("/")
      window.localStorage.removeItem("mello-user")
    })
    .catch(err => console.log(err))
}

export const signUpUser = (
    { name, email, password }, history, setError
) => dispatch => {
    axios
        .post(`${process.env.REACT_APP_API_URI}/users`,
            {  name, email, password }
        )
        .then((res) => {
            window.localStorage.setItem("mello-user", JSON.stringify(res.data.token))
            dispatch(setUser({...res.data.user, token: res.data.token }))
            setError("")
            history.push("/board")
        })
        .catch((e) => {
            if (e.response){ setError(e.response.data) }
        })
}
