# Shared team database setup

The backend uses MySQL. To let every team member see the same registrations,
bookings, services, and payments, all backend instances must use the same
hosted MySQL database.

## One-time setup

1. Create one MySQL database named `cleanpro_db` with a hosted provider.
2. Create the required tables in that database.
3. Allow connections from the team members' IP addresses, or use the provider's
   recommended secure network access.
4. Share the database connection values through a password manager or another
   private team channel. Do not commit them to Git.

## Each developer

1. Copy `cleaning-service-backend/.env.example` to
   `cleaning-service-backend/.env`.
2. Replace the database placeholders with the shared database values.
3. Keep `DB_SKIP_CONNECTION=false`.
4. Copy `cleaning-service-frontend/.env.example` to
   `cleaning-service-frontend/.env`.
5. Start the backend, then start the frontend.

With the default local setup, each frontend calls the local backend at
`http://localhost:5000/api`; every local backend writes to the same hosted
database.

## Shared backend option

If the backend is deployed, set this in each frontend `.env` instead:

```env
VITE_API_BASE_URL=https://your-deployed-backend.example.com/api
```

In that arrangement, the team uses one API server and one database.

## Important rules

- Never commit `.env` files, database passwords, or production JWT secrets.
- Do not use `localhost` as `DB_HOST` when you intend to use the shared database.
- Do not reset or drop shared tables without the team's approval.
- Use separate databases for production and development.
