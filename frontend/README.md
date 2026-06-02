# Appointment App Frontend (React + Vite + Apollo Client)
This frontend provides login/register, appointment management, and reminder popups for the appointment app.
## What this app does
- Registers and logs in users.
- Stores JWT in browser localStorage.
- Lists current user appointments.
- Creates, updates (complete/incomplete), and deletes appointments.
- Polls for due reminder notifications and shows popup alerts.
## Tech stack
- React 19
- Vite 8
- Apollo Client 4
- GraphQL
- Fetch API (used for auth and one appointment create path)
## Project structure
```text
src/
  App.jsx
  main.jsx
  index.css
  api/
    appointment.js
  components/
    AppointmentCounter.jsx
    AppointmentForm.jsx
    AppointmentList.jsx
    Button.jsx
    Header.jsx
    ReminderNotification.jsx
  graphql/
    queries/
      queries.js
    mutations/
      mutations.js
    notifications.js
  pages/
    Home.jsx
    Login.jsx
    Register.jsx
  utils/
    auth.js
```
## Prerequisites
- Node.js 18+
- npm
- Backend API running at `http://localhost:3000`
## Installation
```bash
npm install
```
## Run the frontend
```bash
npm run dev
```
Vite dev server will print the local URL (commonly `http://localhost:5173`).
## Available scripts
- `npm run dev` - start development server
- `npm run build` - production build
- `npm run preview` - preview built app
- `npm run lint` - lint source files
## Backend URLs used by this frontend
Configured directly in source:
- GraphQL: `http://localhost:3000/graphql` (`src/main.jsx`)
- Auth REST:
  - `POST http://localhost:3000/auth/login`
  - `POST http://localhost:3000/auth/register`
- Appointment REST helper base: `http://localhost:3000/appointments` (`src/api/appointment.js`)
## Authentication behavior
Token storage helpers are in `src/utils/auth.js`:
- `saveToken(token)` -> stores at localStorage key `token`
- `getToken()` -> reads token
- `removeToken()` -> deletes token
- `isAuthenticated()` -> boolean check
Apollo auth link in `src/main.jsx` automatically adds:
```http
Authorization: Bearer <token>
```
to GraphQL requests when a token exists.
## Main user flow
1. User opens app.
2. If no token, app shows Login/Register screen (`Home.jsx`).
3. After login/register, token is stored and app loads appointments.
4. User can:
   - Create appointment
   - Toggle completion
   - Delete appointment
5. Reminder component polls due notifications every 5 seconds and shows popup cards.
## GraphQL operations used
### Queries
- `GET_APPOINTMENTS` (`src/graphql/queries/queries.js`)
  - Returns `id`, `name`, `date`, `time`, `completed`.
- `GET_DUE_NOTIFICATIONS` (`src/graphql/notifications.js`)
  - Returns `id`, `name`, `date`, `time`, `notificationType`.
### Mutations
- `UPDATE_APPOINTMENT` (`id`, `completed`)
- `DELETE_APPOINTMENT` (`id`)
- `MARK_NOTIFICATION_SHOWN` (`id`)
Note: `CREATE_APPOINTMENT` mutation exists, but current `Home.jsx` creates appointments via REST helper (`createAppointment`) instead.
## Reminder UI behavior
In `src/components/ReminderNotification.jsx`:
- Polls `dueNotifications` every 5000ms.
- Shows each reminder card for ~5 seconds.
- Calls `markNotificationShown` to prevent repeated display.
## Troubleshooting
### Blank list / unauthorized
- Confirm backend is running.
- Confirm token exists in localStorage.
- Try logging out and logging in again.
### CORS/network errors
- Backend must run with CORS enabled (already enabled in backend `main.ts`).
- Ensure frontend points to the correct backend URL/port.
### No reminder popups
- Ensure appointment times are valid and due.
- Wait for cron + polling intervals (backend checks every minute; frontend polls every 5 seconds).
