import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, withRouter } from "react-router-dom"
import { createStore, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import usersReducer from "./reducers/users";
import App from "./App";

const rootElement = document.getElementById("root");

const rootReducer = combineReducers({users: usersReducer})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

const AppWithRouter = withRouter(App)

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <AppWithRouter />
        </Router>
    </Provider>,
    rootElement
);
