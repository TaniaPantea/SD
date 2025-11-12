import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getUserRole, isTokenExpired } from "./jwt-utils";
import { useHistory } from 'react-router-dom';

function PrivateRoute({ component: Component, allowedRoles, ...rest }) {
    const history = useHistory();
    return (
        <Route
            {...rest}
            render={props => {
                const role = getUserRole();

                if (!role || isTokenExpired()) {
                    return <Redirect to="/auth" />;
                }
                if (allowedRoles && !allowedRoles.includes(role)) {
                    alert("Unauthorized access!");
                    return <Redirect to="/"/>;
                }

                return <Component {...props} />;
            }}
        />
    );
}

export default PrivateRoute;
