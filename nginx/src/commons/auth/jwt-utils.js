import { jwtDecode } from "jwt-decode";

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

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    console.log("User logged out.");
}

export { getUserFromToken, getUserRole, isTokenExpired, logout };
