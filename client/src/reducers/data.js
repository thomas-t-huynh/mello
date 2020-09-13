import { SET_BOARDS, SET_COLUMNS, SET_TASKS } from "../actions/data"

const initialState = {
    tasks: undefined,
    columns: undefined,
    boards: undefined,
    boardOrder: [],
};

const reducer = (state=initialState, action) => {
    switch(action.type) {
        case SET_BOARDS:
            return {
                ...state,
                ...action.payload
            }
        case SET_COLUMNS:
            return {
                ...state,
                columns: action.payload
            }
        case SET_TASKS:
            return {
                ...state,
                tasks: action.payload
            }
        default:
            return state
    }
}

export default reducer;