import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    auth: '/api/auth'
};

function authHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function registerUser(user, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + '/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    RestApiClient.performRequest(request, callback);
}

function loginUser(credentials, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + '/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    RestApiClient.performRequest(request, callback);
}

function deleteUser(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.auth + '/' + id, {
        method: 'DELETE',
        headers: {
            ...authHeader()
        }
    });

    RestApiClient.performRequest(request, callback);
}

export {
    registerUser,
    loginUser,
    deleteUser
};
