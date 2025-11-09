import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    device: '/api/devices'
};

const AUTH_HEADER = 'Basic ' + btoa("user:test");

function getDevices(callback) {
    let request = new Request(HOST.backend_api + endpoint.device, {
        method: 'GET',
        headers: {
            'Authorization': AUTH_HEADER,
        }
    });
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + "/" + params.id, {
        method: 'GET',
        headers: {
            'Authorization': AUTH_HEADER,
        }
    });
    RestApiClient.performRequest(request, callback);
}

function deleteDevice(id, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + '/' + id, {
        method: 'DELETE',
        headers: { 'Authorization': AUTH_HEADER }
    });
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback) {
    let request = new Request(HOST.backend_api + endpoint.device, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': AUTH_HEADER
        },
        body: JSON.stringify(device)
    });
    RestApiClient.performRequest(request, callback);
}

function putDevice(device, callback) {
    let request = new Request(HOST.backend_api + endpoint.device + '/' + device.id, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': AUTH_HEADER
        },
        body: JSON.stringify(device)
    });
    RestApiClient.performRequest(request, callback);
}

export {
    getDevices,
    getDeviceById,
    postDevice,
    putDevice,
    deleteDevice
};
