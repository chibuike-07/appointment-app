# Appointment App Backend (NestJS + GraphQL + PostgreSQL)
This backend powers authentication, appointment CRUD, and reminder notifications for the appointment app.
## What this service does
- Registers and logs in users using email/password.
- Issues JWT access tokens.
- Protects appointment APIs with JWT auth.
- Stores users and appointments in PostgreSQL using TypeORM.
- Exposes:
  - REST endpoints for auth and appointment CRUD.
  - GraphQL queries/mutations for appointment operations and notifications.
- Runs a cron job every minute to generate reminder notifications.
## Tech stack
- NestJS 11
- GraphQL (Apollo)
- TypeORM
- PostgreSQL
- Passport JWT + bcrypt
- @nestjs/schedule (cron reminders)
## Project structure
```text
src/
  app.module.ts
  main.ts
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    jwt.strategy.ts
    gql-auth.guard.ts
  users/
    user.entity.ts
    users.module.ts
    users.service.ts
  appointments/
    appointment.entity.ts
    appointments.controller.ts
    appointments.resolver.ts
    appointments.service.ts
    reminder.service.ts
```
## Prerequisites
- Node.js 18+
- npm
- PostgreSQL running locally
## Database configuration used by this code
Configured in `src/app.module.ts`:
- host: `localhost`
- port: `5432`
- username: `postgres`
- password: `postgres`
- database: `appointments_db`
- `synchronize: true` (auto-creates/updates schema in development)
Create the database before starting:
```sql
CREATE DATABASE appointments_db;
```
## Installation
```bash
npm install
```
## Run the backend
```bash
# development with watcher
npm run start:dev
```
Server starts on:
- `http://localhost:3000`
- GraphQL endpoint: `http://localhost:3000/graphql`
## Available scripts
- `npm run start` - start once
- `npm run start:dev` - start with watch mode
- `npm run start:prod` - run compiled output
- `npm run build` - build TypeScript
- `npm run lint` - lint and auto-fix
- `npm run test` - unit tests
- `npm run test:e2e` - e2e tests
- `npm run test:cov` - coverage
## Authentication flow
### 1) Register
`POST /auth/register`
Body:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```
### 2) Login
`POST /auth/login`
Body:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```
Success response:
```json
{
  "access_token": "<jwt-token>"
}
```
### 3) Use token
Send JWT on protected requests:
```http
Authorization: Bearer <jwt-token>
```
## REST appointment endpoints (JWT protected)
Base route: `/appointments`
- `GET /appointments` - get current user appointments
- `POST /appointments` - create appointment
- `PATCH /appointments/:id` - update appointment fields
- `DELETE /appointments/:id` - delete appointment
### Create appointment body
```json
{
  "name": "Dentist",
  "date": "2026-06-03",
  "time": "14:30"
}
```
### Validation/business rules in service
- Name cannot be empty.
- Cannot create appointments in the past.
- Cannot create two appointments for the same user at the exact same date/time.
## GraphQL API (JWT protected)
Endpoint: `POST /graphql`
### Queries
- `appointments`: returns current user appointments
- `dueNotifications`: returns unshown due reminders for current user
### Mutations
- `createAppointment(name, date, time)`
- `updateAppointment(id, completed)`
- `deleteAppointment(id)`
- `markNotificationShown(id)`
## Reminder system
Implemented in `src/appointments/reminder.service.ts`:
- Cron runs every minute: `* * * * *`.
- For each appointment:
  - Sets a "before" reminder when current time reaches 15 minutes before the appointment.
  - Sets an "at" reminder when current time reaches appointment time.
- Flags used:
  - `reminderBeforeSent`
  - `reminderAtSent`
  - `notificationShown`
  - `notificationType` (`before` or `at`)
Frontend polls `dueNotifications` and then calls `markNotificationShown`.
## Entities
### `User`
- `id`
- `email` (unique)
- `password` (hashed)
### `Appointment`
- `id`
- `name`
- `date` (string)
- `time` (string)
- `completed` (boolean)
- `user` (many-to-one)
- `reminderBeforeSent` (boolean)
- `reminderAtSent` (boolean)
- `notificationShown` (boolean)
- `notificationType` (nullable string)
## Important implementation notes
- JWT secret is currently hardcoded in `auth.module.ts` and `jwt.strategy.ts` as `myappointmentappsecret`.
- CORS is enabled globally in `main.ts`.
- GraphQL schema is auto-generated to `src/schema.gql`.
## Troubleshooting
### Cannot connect to database
- Ensure PostgreSQL is running.
- Confirm username/password/db name match `app.module.ts`.
### `Unauthorized` errors
- Ensure you logged in and are sending `Authorization: Bearer <token>`.
- Ensure frontend is storing token in localStorage key `token`.
### Port already in use
- Default is port `3000`.
- Stop conflicting process or set `PORT` before startup.
