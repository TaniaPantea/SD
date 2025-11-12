import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import NavigationBar from './navigation-bar';
import Home from './home/home';
import UserContainer from './user/user-container';
import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import DeviceContainer from './device/device-container';
import LoginForm from "./auth/components/login-form";
import AuthContainer from "./auth/auth-container";
import PrivateRoute from "./commons/auth/private-route";

/*
    Namings: https://reactjs.org/docs/jsx-in-depth.html#html-tags-vs.-react-components
    Should I use hooks?: https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both
*/
function App() {
    return (
        <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>

                        <Route
                            exact
                            path='/'
                            render={() => <Home />}
                        />

                        <PrivateRoute
                            exact
                            path='/user'
                            component={UserContainer}
                            allowedRoles={['ADMIN','CLIENT']}
                        />

                        <PrivateRoute
                            exact
                            path='/devices'
                            component={DeviceContainer}
                            allowedRoles={['ADMIN', 'CLIENT']}
                        />

                        <Route
                            exact
                            path='/auth'
                            render={() => <AuthContainer />}
                        />

                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage />}
                        />

                        <Route render={() => <ErrorPage />} />
                    </Switch>
                </div>
            </Router>
        </div>
    );
}

export default App;
