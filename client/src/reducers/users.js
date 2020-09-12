import { SET_USER } from "../actions/users";

const initialState = {
    account: {}
};

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_USER:
            return {account: action.payload}
        default:
            return state
    }
}

export default reducer;