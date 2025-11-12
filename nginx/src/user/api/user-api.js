import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    user: '/api/people'
};

function authHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function getUsers(callback) {
    const request = new Request(HOST.backend_api + endpoint.user, {
        method: 'GET',
        headers: {
            ...authHeader()
        }
    });

    console.log("GET all users -> " + request.url);
    RestApiClient.performRequest(request, callback);
}

function getUserById(params, callback) {
    const request = new Request(HOST.backend_api + endpoint.user + "/" + params.id, {
        method: 'GET',
        headers: {
            ...authHeader()
        }
    });

    console.log("GET user by id -> " + request.url);
    RestApiClient.performRequest(request, callback);
}

function deleteUser(id, callback) {
    const request = new Request(HOST.backend_api + endpoint.user + '/' + id, {
        method: 'DELETE',
        headers: {
            ...authHeader()
        }
    });

    console.log("DELETE user -> " + request.url);
    RestApiClient.performRequest(request, callback);
}

function postUser(user, callback) {
    const request = new Request(HOST.backend_api + endpoint.user, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(user)
    });

    console.log("POST user -> " + request.url);
    RestApiClient.performRequest(request, callback);
}

function putUser(user, callback) {
    const request = new Request(HOST.backend_api + endpoint.user + '/' + user.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeader()
        },
        body: JSON.stringify(user)
    });

    console.log("PUT user -> " + request.url);
    RestApiClient.performRequest(request, callback);
}

export {
    getUsers,
    getUserById,
    postUser,
    deleteUser,
    putUser
};
