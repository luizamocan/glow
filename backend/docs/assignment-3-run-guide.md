# Assignment 3 Run Guide

## What Was Implemented

- Relational database persistence with Sequelize ORM and SQLite.
- ORM-generated tables for `services`, `clients`, `appointments`, and `users`.
- CRUD operations for services, clients, and appointments.
- Database-backed login/register endpoints for admin/client access.
- Filters and pagination for services and clients.
- Statistics for services.
- A normalized schema where appointments reference services and clients by foreign keys.
- Role and permission management with `roles`, `permissions`, `user_roles`, and `role_permissions`.
- Real-time chat with WebSockets and a JSON NoSQL-style message store.
- MongoDB NoSQL activity logs for the Silver database requirement.
- Gold Challenge security logging with `action_logs` and `observation_list`.

## Database Commands

From `backend`:

```bash
npm install
npm run migrate
npm test
npm start
```

`npm run migrate` creates/synchronizes the SQLite schema from the Sequelize models. The database file is generated at runtime in `backend/data/glow.sqlite`.

Seeded demo accounts:

```text
Admin:  admin@glowandshine.com / Admin@123
Client: client@glowandshine.com / Client@123
```

## Virtual Machine / Different Machine Requirement

Run the backend on one real or virtual machine:

```bash
cd backend
npm install
npm run migrate
npm start
```

The server listens on `0.0.0.0:5000`, so it accepts connections from other machines on the same network.

On the server machine, find its LAN IP address.

Windows:

```bash
ipconfig
```

Linux/macOS:

```bash
ip addr
```

Then run the frontend from a different real or virtual machine and call the backend with:

```text
http://SERVER_LAN_IP:5000
```

For React, start the frontend with the backend IP.

Command Prompt:

```bash
set REACT_APP_API_URL=http://SERVER_LAN_IP:5000
npm start
```

PowerShell:

```powershell
$env:REACT_APP_API_URL="http://SERVER_LAN_IP:5000"
npm start
```

For the demo, do not use `http://localhost:5000` from the client machine. Use the actual IP address of the machine running the backend.

If Windows Firewall asks for permission for Node.js, allow private network access.

## Tests

The database setup is tested in:

- `backend/tests/database.test.js`
- `backend/tests/services.test.js`

Run:

```bash
cd backend
npm test
```

The tests cover ORM schema creation, relational tables, foreign keys, uniqueness, seeded users, admin login, CRUD operations, filters, statistics, and appointment-client-service persistence.

## Gold Challenge Demo

The backend persists each logged-in action in `action_logs`.

Each log entry stores:

```text
USER_ID
GROUP_ID / ROLE
ACTION_INFORMATION
HTTP METHOD
ENDPOINT
STATUS CODE
IP ADDRESS
TIMESTAMP
```

The malicious-behavior detector places suspicious identities in `observation_list`.

Current detection rules:

- 3 failed login attempts in 10 minutes -> high severity.
- 3 delete actions in 5 minutes -> high severity.
- 5 failed/invalid requests in 10 minutes -> medium severity.
- 20 actions in 5 minutes -> medium severity.

Admin frontend demo:

```text
Login as admin -> open Security Logs from the admin sidebar
```

API demo:

```powershell
Invoke-RestMethod http://localhost:5000/api/security/logs
Invoke-RestMethod http://localhost:5000/api/security/observations
```

Trigger suspicious behavior:

```powershell
Invoke-RestMethod -Method Post http://localhost:5000/api/auth/login -ContentType "application/json" -Body '{"email":"bad@example.com","password":"wrong"}'
Invoke-RestMethod -Method Post http://localhost:5000/api/auth/login -ContentType "application/json" -Body '{"email":"bad@example.com","password":"wrong"}'
Invoke-RestMethod -Method Post http://localhost:5000/api/auth/login -ContentType "application/json" -Body '{"email":"bad@example.com","password":"wrong"}'
```

Then refresh the Security Logs page or call:

```powershell
Invoke-RestMethod http://localhost:5000/api/security/observations
```
