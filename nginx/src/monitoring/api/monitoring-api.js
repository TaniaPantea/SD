import { HOST } from "../../commons/hosts";
import RestClient from "../../commons/api/rest-client";
import * as jwt from "../../commons/auth/jwt-utils";

const monitoring_path = '/api/monitoring';

function authHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': 'Bearer ' + token } : {};
}

function getHourlyConsumption(deviceId, callback) {
    let request = new Request(HOST.backend_api + monitoring_path + "/" + deviceId, {
        method: 'GET',
        headers: {
            ...authHeader(),
        }
    });
    console.log(`Fetching hourly consumption for device: ${deviceId}`);
    RestClient.performRequest(request, callback);
}

function getDevicesFromMonitoring(userId, callback) {
    let request = new Request(HOST.backend_api + monitoring_path + "/user/" + userId, {
        method: 'GET',
        headers: {
            ...authHeader(),
        }
    });
    RestClient.performRequest(request, callback);
}

export {
    getHourlyConsumption, getDevicesFromMonitoring
};