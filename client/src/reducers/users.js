import { SET_USER } from "../actions/users";

const initialState = {
    account: {},
    headers: {}
};

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_USER:
            return {account: action.payload, headers: {
                "Content-Type": "application/json",
                Authorization: action.payload.token
            }}
        default:
            return state
    }
}

export default reducer;