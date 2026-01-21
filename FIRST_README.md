# The SD Project: Microservices Application

This is a web application designed to manage users and their devices efficiently. The project uses a **microservices architecture** to ensure security and scalability.

---

##  Project Components

The application is built from **three separate backend microservices** and a **React-based frontend**. Each service has a specific job:

* **AuthMicroservice:** Handles **user authentication**, including registration, login, and **generating/validating JWT tokens**.
* **UserMicroservice:** Manages **user profile data** (age, address, etc.) and performs CRUD operations (Create, Read, Update, Delete) on user profiles.
* **DeviceMicroservice:** Manages **device inventory**, handling device creation, assignment, and ownership tracking.

##  Security and Access

Security is enforced through **JSON Web Tokens (JWT)** and **role-based access control**.

* **Token Validation:** All requests must include a valid JWT token. Validation is handled by the **Traefik API Gateway**, which checks the token with the AuthMicroservice before forwarding the request.
* **Role Protection:** The system defines two main roles:
    * **Admin:** Has **full access (CRUD)** to all users and devices.
    * **Client:** Can only **view devices assigned to them**.

## 🔗 API Endpoints

The API is structured across three microservices. All endpoints are prefixed with `/api` by the Traefik Gateway.

###  1. AuthMicroservice (`/api/auth`)

Handles identity management and token operations.

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Creates a new user identity and returns the generated `userId` for synchronization. | Public |
| **POST** | `/auth/login` | Authenticates user credentials and returns a JWT `token`. | Public |
| **GET** | `/auth/validate` | Checks the validity and status of the provided JWT token. | Protected |
| **DELETE** | `/auth/{id}` | Deletes a user identity from the Auth system. | Protected |

###  2. UserMicroservice (`/api/people`)

Manages user profiles and extended details (synced from Auth backend).

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/people` | Retrieves a list of all user profiles and details. | Protected |
| **POST** | `/people` | Creates (synchronizes) a new user profile using a pre-generated ID (from Auth). | Public (for synchronization) |
| **GET** | `/people/{id}` | Retrieves detailed information for a specific user ID. | Protected |
| **PUT** | `/people/{id}` | Updates all profile details for a specific user ID. | Protected |
| **DELETE** | `/people/{id}` | Deletes a user profile from the Users system. | Protected |

###  3. DeviceMicroservice (`/api/devices`)

Manages device inventory and user assignments.

| Method | Path | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/devices` | Retrieves a list of all devices in the system. | Protected |
| **POST** | `/devices` | Creates a new device record and assigns it to a user. | Protected |
| **GET** | `/devices/{id}` | Retrieves detailed information for a specific device ID. | Protected |
| **PUT** | `/devices/{id}` | Updates device details (e.g., max consumption, owner). | Protected |
| **DELETE** | `/devices/{id}` | Deletes a device from the inventory. | Protected |
| **GET** | `/devices/by-name` | Finds devices matching a specific name query (`?name=...`). | Protected |
| **GET** | `/devices/by-userId` | Finds devices assigned to a specific user ID (`?userId=...`). (Used by Clients). | Protected |

---

##  Getting Started

The entire system is set up using **Docker Compose**.

1.  **Launch:** Run `docker-compose up --build` in the project's root directory.
2.  **Access:** The frontend is available at `http://localhost`.

**Important:** An initial **Admin account** must be created in the database to start managing the system from the web interface.

---

##  Features at a Glance

* **Secure Authentication:** Uses JWT for stateless authentication.
* **Role-Based Access:** Restricts features based on user role (Admin or Client).
* **Data Separation:** Microservices clearly separate identity (Auth) from resources (User/Device).
* **CRUD Operations:** Full management capabilities for user profiles and devices.