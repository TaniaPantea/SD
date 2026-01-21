import { jwtDecode } from "jwt-decode";
import {disconnectFromNotifications} from "../../monitoring/api/notification-api";

function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded; // are sub, role, exp, etc.
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}
function getUserId() {
    const user = getUserFromToken();
    if (!user) return null;

    return user.userId || null;
}

function getUserRole() {
    const user = getUserFromToken();
    return user?.role || null;
}

function isTokenExpired() {
    const user = getUserFromToken();
    if (!user?.exp) return true;

    const now = Date.now() / 1000;
    return user.exp < now;
}

function getUserName() {
    const user = getUserFromToken();
    if (!user) return null;
    // Verifică unde stochează backend-ul tău numele (sub, name, sau preferred_username)
    return user.sub || user.name || user.username || null;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    disconnectFromNotifications();
    console.log("User logged out.");
}

export { getUserFromToken, getUserRole, isTokenExpired, logout, getUserId, getUserName};
