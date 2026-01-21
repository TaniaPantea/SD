import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './navigation-bar';
import Home from './home/home';
import UserContainer from './user/user-container';
import DeviceContainer from './device/device-container';
import AuthContainer from "./auth/auth-container";
import MonitoringContainer from "./monitoring/monitoring-container";
import ChatContainer from "./chat/chat-container";
import AdminChatContainer from "./chat/admin-chat-container";
import PrivateRoute from "./commons/auth/private-route";
import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';

function App() {
    return (
        <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>
                        <Route exact path='/' render={() => <Home />} />
                        <Route exact path='/auth' render={() => <AuthContainer />} />

                        <PrivateRoute exact path='/user' component={UserContainer} allowedRoles={['ADMIN','CLIENT']} />
                        <PrivateRoute exact path='/devices' component={DeviceContainer} allowedRoles={['ADMIN', 'CLIENT']} />
                        <PrivateRoute exact path='/monitoring' component={MonitoringContainer} allowedRoles={['ADMIN', 'CLIENT']} />

                        <PrivateRoute
                            exact
                            path='/admin-chat'
                            component={AdminChatContainer}
                            allowedRoles={['ADMIN']}
                        />

                        <Route exact path='/error' render={() => <ErrorPage />} />
                        <Route render={() => <ErrorPage />} />
                    </Switch>
                    <ChatContainer />
                </div>
            </Router>
        </div>
    );
}

export default App;