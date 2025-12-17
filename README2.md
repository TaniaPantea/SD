# The SD Project: Microservices Application (Enhanced Version)

Acesta este o aplicație web avansată pentru gestionarea utilizatorilor și a consumului dispozitivelor lor, construită pe o **arhitectură de microservicii** scalabilă și securizată. Proiectul include acum monitorizarea consumului de energie în timp real.

---

## 🏗 Project Components

Sistemul este compus din **patru microservicii backend**, un **simulator de date** și un **frontend bazat pe React**:

* **AuthMicroservice:** Gestionează identitatea utilizatorilor, înregistrarea, login-ul și generarea/validarea token-urilor **JWT**.
* **UserMicroservice:** Administrează datele de profil (vârstă, adresă etc.) și sincronizează profilurile create în sistemul de Auth.
* **DeviceMicroservice:** Gestionează inventarul de dispozitive, maparea acestora către utilizatori și furnizează date active către simulator.
* **MonitoringMicroservice:** Consumă măsurătorile de la dispozitive prin RabbitMQ, calculează consumul orar și stochează datele pentru analiză.
* **Device Simulator (Python):** Simulează comportamentul dispozitivelor reale, trimițând măsurători aleatorii la intervale regulate (10 secunde).

---

## Security and Access

Securitatea este implementată prin **JSON Web Tokens (JWT)** și controlul accesului bazat pe roluri (**RBAC**).

* **Token Validation:** Toate cererile trec prin **Traefik API Gateway**, care validează token-ul prin AuthMicroservice înainte de redirecționare.
* **Role Protection:**
    * **Admin:** Acces complet (CRUD) asupra utilizatorilor și dispozitivelor.
    * **Client:** Poate vizualiza doar dispozitivele proprii și diagramele de consum asociate.

---

## Real-Time Monitoring & Messaging

Sistemul utilizează **RabbitMQ** ca broker de mesaje pentru procesarea asincronă a datelor:

1.  **Simulatorul** preia ID-urile dispozitivelor active din `DeviceMicroservice`.
2.  Măsurătorile sunt publicate în coada `device-measurement-queue`.
3.  **MonitoringMicroservice** ascultă coada, procesează valorile și salvează consumul orar în baza de date proprie (`monitoring-db`).

---

## API Endpoints

Toate endpoint-urile sunt prefixate cu `/api` prin Traefik.

### 1. AuthMicroservice (`/api/auth`)
| Metodă | Cale | Descriere | Acces |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Crează identitate nouă și returnează `userId`. | Public |
| **POST** | `/auth/login` | Autentifică și returnează un token JWT. | Public |
| **GET** | `/auth/validate` | Verifică validitatea token-ului. | Protejat |

### 2. UserMicroservice (`/api/people`)
| Metodă | Cale | Descriere | Acces |
| :--- | :--- | :--- | :--- |
| **GET** | `/people` | Listă cu toate profilurile. | Protejat (Admin) |
| **POST** | `/people` | Sincronizează profilul nou (ID de la Auth). | Public (Sync) |
| **DELETE** | `/people/{id}` | Șterge profilul din sistem. | Protejat (Admin) |

### 3. DeviceMicroservice (`/api/devices`)
| Metodă | Cale | Descriere | Acces |
| :--- | :--- | :--- | :--- |
| **GET** | `/devices` | Toate dispozitivele din sistem. | Protejat (Admin) |
| **POST** | `/devices` | Crează și alocă un dispozitiv unui utilizator. | Protejat (Admin) |
| **GET** | `/devices/active-ids`| Returnează UUID-urile active pentru simulator. | Intern/Protejat |

### 4. MonitoringMicroservice (`/api/monitoring`)
| Metodă | Cale | Descriere | Acces |
| :--- | :--- | :--- | :--- |
| **GET** | `/monitoring/hourly/{id}` | Datele de consum orar pentru un dispozitiv. | Protejat |

---

## Getting Started

Sistemul este complet containerizat folosind **Docker Compose**.

1.  **Configurare Rețea:** Asigurați-vă că rețeaua `my_net` este creată (`docker network create my_net`) dacă este marcată ca externă.
2.  **Lansare:** Executați `docker-compose up --build` în directorul rădăcină.
3.  **Baze de date:** Sistemul pornește 4 instanțe PostgreSQL separate pentru izolarea datelor: `user-db`, `device-db`, `auth-db` și `monitoring-db`.
4.  **Acces:**
    * Frontend: `http://localhost`
    * RabbitMQ Management: `http://localhost:15672` (user: `guest`, pass: `guest`)
    * Traefik Dashboard: `http://localhost:8080`

---

## Features

* **Arhitectură Microservicii:** Decuplare totală între identitate, resurse și monitorizare.
* **Procesare Asincronă:** Integrare cu RabbitMQ pentru fluxuri de date de mare viteză.
* **Simulator Integrat:** Permite testarea sistemului fără hardware real.
* **Interfață React:** Vizualizare dinamică a consumului sub formă de grafice.