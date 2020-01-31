import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import App from "./App";
import Register from "./auth/register";

const Root = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={App} />
            </Switch>
        </Router>
    )
}