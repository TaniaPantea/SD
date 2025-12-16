import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    device: '/api/devices'
};

function authHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function getDevices(callback) {
    const request = new Request(HOST.backend_api + endpoint.device, {
        method: 'GET',
        headers: {
            ...authHeader(),
        }
    });
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback) {
    const request = new Request(HOST.backend_api + endpoint.device + "/" + params.id, {
        method: 'GET',
        headers: {
            ...authHeader(),
        }
    });
    RestApiClient.performRequest(request, callback);
}

function deleteDevice(id, callback) {
    const request = new Request(HOST.backend_api + endpoint.device + '/' + id, {
        method: 'DELETE',
        headers: {
            ...authHeader(),
        }
    });
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback) {
    const request = new Request(HOST.backend_api + endpoint.device, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeader(),
        },
        body: JSON.stringify(device)
    });
    RestApiClient.performRequest(request, callback);
}

function putDevice(device, callback) {
    const request = new Request(HOST.backend_api + endpoint.device + '/' + device.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...authHeader(),
        },
        body: JSON.stringify(device)
    });
    RestApiClient.performRequest(request, callback);
}

function getActiveDevicesByUserId(userId, callback) {
    if (!userId) {
        console.error("User ID is required to fetch devices.");
        return;
    }
    const url = HOST.backend_api + endpoint.device + "/by-userId?userId=" + userId;
    const request = new Request(url, {
        method: 'GET',
        headers: {
            ...authHeader(),
        }
    });
    console.log(`Fetching active devices for User ID: ${userId} from ${url}`);
    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    putDevice,
    deleteDevice,
    getActiveDevicesByUserId
};
