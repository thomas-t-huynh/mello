import axios from 'axios'

export const SET_USER = "SET_USER"

export const setUser = (user) => ({
    type: SET_USER,
    payload: user
})

export const loginUser = (token) => {
    return dispatch => {
        const headers = {
            "Content-Type": "application/json",
            Authorization: token
        };
        axios
        .get(`${process.env.REACT_APP_API_URI}/users/me`, { headers })
        .then(res => {
            dispatch(setUser({ ...res.data, token }))
        })
        .catch(err => console.log(err));
    }
}