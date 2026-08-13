## DriveEasy Frontend

A React + TypeScript single-page app for the DriveEasy car rental API (`../Group Project`). Built with Vite and React Router.

## Running

1. Start the backend API first (from `../Group Project`):
   ```
   npm install
   npm run dev
   ```
   It listens on `http://localhost:3001` and requires a running MySQL instance with the `driveeasy` database.

2. In this folder, install and start the frontend:
   ```
   npm install
   npm run dev
   ```
   It listens on `http://localhost:5173` and talks to the API at `http://localhost:3001` by default. 

## Structure

- `src/api/`- typed fetch wrappers, one module per resource (`cars`, `users`, `rentals`, `payments`)
- `src/types.ts`- shared TypeScript types matching the database schema
- `src/components/<resource>/`- form + table components per resource
- `src/pages/`- one page per route, wiring data loading and CRUD handlers to the components
- `src/hooks/useFeedback.ts`- shared success/error banner state used on every page
