# NoSQL Silver Guide

This project uses MongoDB as a NoSQL document database for activity/audit logs.

SQLite remains the relational source of truth for normalized entities:

- services
- clients
- appointments
- users
- roles and permissions

MongoDB stores flexible documents in the `activity_logs` collection. The backend mirrors actions such as login, register, service CRUD, appointment CRUD, chat, and security events into MongoDB when Mongo is running.

## Start MongoDB With Docker

From the project root:

```bash
docker compose up -d mongo
```

Then start the backend:

```bash
cd backend
npm run migrate
npm start
```

If MongoDB is connected, the backend prints:

```text
NoSQL: connected to mongodb://127.0.0.1:27017/glow_nosql
```

If MongoDB is not running, the relational app still works and the backend prints a warning.

## View NoSQL Logs

After logging in, adding a service, booking an appointment, or using chat, open:

```text
http://localhost:5000/api/activity
```

Optional filter:

```text
http://localhost:5000/api/activity?actionType=auth.login
```

Expected response shape:

```json
{
  "connected": true,
  "data": []
}
```
