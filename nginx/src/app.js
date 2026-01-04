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
import MonitoringContainer from "./monitoring/monitoring-container";
import ChatContainer from "./chat/chat-container";
import { useLocation } from 'react-router-dom';

/*
    Namings: https://reactjs.org/docs/jsx-in-depth.html#html-tags-vs.-react-components
    Should I use hooks?: https://reactjs.org/docs/hooks-faq.html#should-i-use-hooks-classes-or-a-mix-of-both
*/

function AppContent() {
    const location = useLocation();

    // Verificăm dacă suntem pe pagina de monitoring
    const isMonitoringPage = location.pathname === '/monitoring';

    return (
        <div>
            <NavigationBar />
            <Switch>
                <Route exact path='/' render={() => <Home />} />

                <PrivateRoute
                    exact path='/user'
                    component={UserContainer}
                    allowedRoles={['ADMIN','CLIENT']}
                />

                <PrivateRoute
                    exact path='/devices'
                    component={DeviceContainer}
                    allowedRoles={['ADMIN', 'CLIENT']}
                />

                <Route exact path='/auth' render={() => <AuthContainer />} />

                <PrivateRoute
                    exact path='/monitoring'
                    component={MonitoringContainer}
                    allowedRoles={['ADMIN', 'CLIENT']}
                />

                <Route exact path='/error' render={() => <ErrorPage />} />
                <Route render={() => <ErrorPage />} />
            </Switch>

            {/* Chat-ul este acum în interiorul contextului de Router și verifică locația corect */}
            {isMonitoringPage && <ChatContainer />}
        </div>
    );
}

function App() {
    return (
        <div className={styles.back}>
            <Router>
                <AppContent />
            </Router>
        </div>
    );
}

export default App;