# The SD Project: Microservices Application (Enhanced Version)

Acesta este o aplicație web avansată pentru gestionarea utilizatorilor și a consumului dispozitivelor lor, construită pe o **arhitectură de microservicii** scalabilă și securizată. Proiectul include acum monitorizarea consumului de energie în timp real.

---

## Project Components

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

# The SD Project: Microservices Application (Enhanced Version)

Acesta este o aplicație web avansată pentru gestionarea utilizatorilor și a consumului dispozitivelor lor, construită pe o **arhitectură de microservicii** scalabilă și securizată. Proiectul include acum monitorizarea consumului de energie în timp real, asistență AI și suport chat.

---

## Project Components

Sistemul este compus din **cinci microservicii backend**, un **simulator de date** și un **frontend bazat pe React**:

* **AuthMicroservice:** Gestionează identitatea utilizatorilor, login-ul și validarea token-urilor **JWT**.
* **UserMicroservice:** Administrează datele de profil și sincronizează profilurile cu sistemul de Auth.
* **DeviceMicroservice:** Gestionează inventarul de dispozitive și maparea acestora către utilizatori.
* **MonitoringMicroservice:** Consumă măsurătorile prin RabbitMQ, calculează consumul orar și detectează depășirile de limite.
* **WebSocketMicroservice (Communication):** Gestionează chat-ul în timp real și livrarea alertelor de consum către frontend.
* **Device Simulator (Python):** Trimite măsurători simulate la fiecare 10 secunde pentru dispozitivele active.

---

##  Real-Time Customer Support & AI

Sistemul implementează un flux hibrid de asistență pentru utilizatori:

1.  **Rule-Based Bot:** Răspunsuri instantanee pentru întrebări frecvente (ex: "broken line", "consum").
2.  **Smart-AI (Gemini Integration):** Utilizarea modelului **Gemini Flash** pentru a genera răspunsuri inteligente atunci când cererea nu are un răspuns predefinit.
3.  **Human Support (Admin Chat):** Utilizatorii pot contacta un administrator folosind prefixul `admin`. Administratorii dispun de o consolă dedicată (`/admin-chat`) pentru a gestiona conversațiile simultane.

---

##  Real-Time Monitoring & Notifications

Transportul datelor asincrone este realizat prin **RabbitMQ** și livrat în UI prin **WebSockets (STOMP)**:

* **Alerte de Supraconsum:** Când consumul orar depășește limita setată, MonitoringMicroservice emite o alertă. Utilizatorul primește instantaneu o notificare de tip *Toast*.
* **Live Updates:** Interfața grafică (graficul de tip broken line) se reîmprospătează automat la primirea unei notificări de date noi, fără reîncărcarea paginii.



---

## Scalability & Load Balancing

Aplicația este pregătită pentru producție folosind **Docker Swarm** și **Traefik API Gateway**:

* **HTTP Load Balancing:** Traefik distribuie traficul către microservicii.
* **Sticky Sessions:** Implementate pentru `spring-websocket` pentru a asigura stabilitatea sesiunilor de chat prin cookie-uri (`chat_session_id`).
* **Simulator Traffic Offloading (Cerința 1.1.3):**
    * Implementarea unui **Single Consumer** pentru datele de la simulator.
    * Distribuirea măsurătorilor către **cozi dedicate per replică** (`monitoring_queue_{index}`).
    * Utilizarea **Consistent Hashing** pe `deviceId` pentru a asigura că datele aceluiași dispozitiv sunt procesate mereu de aceeași replică.

---

## API Endpoints & Topics

### WebSocket Topics
| Topic | Acces | Descriere |
| :--- | :--- | :--- |
| `/topic/notifications` | Public/User | Alerte de consum în timp real. |
| `/topic/chat.{userId}` | Privat User | Canal pentru mesaje de la Bot, AI sau Admin. |
| `/topic/admin` | Admin | Canal global pentru cererile de suport primite. |

### Microservices REST API
| Metoda | Cale | Serviciu | Acces |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Auth | Public |
| **GET** | `/api/monitoring/hourly/{id}`| Monitoring | Protejat |
| **POST** | `/api/admin.reply` | WebSocket | Protejat (Admin) |

---

## Getting Started (Swarm Mode)

1.  **Initializare Swarm:** `docker swarm init`
2.  **Configurare Retea:** `docker network create --driver overlay my_net`
3.  **Deploy:** `docker stack deploy -c docker-compose.yml ems_stack`
4.  **Acces:**
    * Frontend: `http://localhost`
    * Traefik Dashboard: `http://localhost:8080`
    * RabbitMQ Management: `http://localhost:15672`

---

## Features 

* **Arhitectură Microservicii:** Decuplare totală și baze de date izolate (PostgreSQL).
* **Securitate:** JWT (JSON Web Tokens) și Role-Based Access Control.
* **Asistență AI:** Integrare nativă cu Google Gemini API.
* **Scalabilitate:** Replicare dinamică a serviciilor și Load Balancing inteligent.
