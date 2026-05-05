# Glow & Shine Database Normalization

The database is relational and generated from Sequelize ORM models, not hand-written SQL.

## Tables

`services`

- `id` primary key
- `name` unique service name
- `price`
- `duration`
- `description`

`appointments`

- `id` primary key
- `service_id` foreign key to `services.id`
- `client_id` foreign key to `clients.id`
- `date`
- `time`
- `status`
- `rating`

`clients`

- `id` primary key
- `name`
- `email` unique
- `phone`

`users`

- `id` primary key
- `client_id` nullable foreign key to `clients.id`
- `name`
- `email` unique
- `password`
- `role`

## 3NF Argument

The schema is in 1NF because every column stores atomic scalar values and each row has a primary key.

The schema is in 2NF because there are no composite primary keys, so every non-key attribute depends on the whole primary key of its table.

The schema is in 3NF because non-key attributes do not depend on other non-key attributes. Appointment rows reference service data through `service_id` and client data through `client_id`; service name, price, duration, description, client name, email, phone, and user role are stored only in their own tables, avoiding transitive dependency and duplicated facts in `appointments`.
