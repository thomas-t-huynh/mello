import { SET_DATA } from "../actions/data"

const initialState = {
    tasks: undefined,
    columns: undefined,
    boards: undefined,
    boardOrder: [],
};

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_DATA:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}

export default reducer;