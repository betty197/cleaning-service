# CleanPro Frontend

Professional React + Vite frontend for the Cleaning Service Management System.

## Backend used

The frontend is configured for:

`http://localhost:3001/api`

The API routes supplied for this project are:

- `/users`
- `/services`
- `/bookings`
- `/payments`

The frontend does **not** create or change backend routes.

## Important authentication note

The API list supplied for this frontend does not contain a login/authentication endpoint.

Because fake authentication is not safe, the login page intentionally does not pretend that login works. To enable real login, the backend needs an authentication endpoint such as:

`POST /api/auth/login`

A real authentication response should contain a signed access token (for example JWT) and enough user information to determine the user's ID and role.

Until that endpoint exists, customer/admin protected workflows cannot be authenticated from the frontend.

## Fields used from the supplied ERD

Users:
`id, full_name, email, phone, password, role, address, profile_image, created_at`

Services:
`id, service_name, description, price, duration_hours, image, status`

Bookings:
`id, customer_id, service_id, booking_date, booking_time, address, status, created_at`

Payments:
`id, booking_id, amount, payment_method, payment_status, payment_date`

## Install

Open a terminal inside this folder:

```bash
npm install
```

## Run

Start the backend first, then:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally:

`http://localhost:5173`

## If your backend is actually on another port

Create `.env` from `.env.example` and change:

`VITE_API_BASE_URL=http://localhost:YOUR_PORT/api`

Do not change the API route names unless your backend actually uses different routes.

## CORS

The backend must allow the Vite frontend origin, normally:

`http://localhost:5173`

## Main routes

Public:
- `/`
- `/services`
- `/register`
- `/login`

Customer:
- `/booking`
- `/my-bookings`
- `/profile`

Admin:
- `/admin`
- `/admin/users`
- `/admin/services`
- `/admin/bookings`
- `/admin/payments`

## Testing checklist

1. Start MySQL.
2. Start the Express backend on port 3001.
3. Confirm `GET http://localhost:3001/api/services` works.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open `/services` and confirm real services load.
7. Open `/register` and test `POST /api/users`.
8. Test booking only after real authentication is added.
9. Test admin pages only after real authentication/role checking is added.

## Why login is not faked

The provided route list has no login endpoint. Storing a typed email/password and treating the user as logged in would be fake authentication. This project deliberately avoids that.
