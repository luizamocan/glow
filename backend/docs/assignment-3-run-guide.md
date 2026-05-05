# Assignment 3 Run Guide

## What Was Implemented

- Relational database persistence with Sequelize ORM and SQLite.
- ORM-generated tables for `services`, `clients`, `appointments`, and `users`.
- CRUD operations for services, clients, and appointments.
- Database-backed login/register endpoints for admin/client access.
- Filters and pagination for services and clients.
- Statistics for services.
- A normalized schema where appointments reference services and clients by foreign keys.

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
