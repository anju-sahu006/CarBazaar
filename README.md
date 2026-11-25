# CarBazaar – Find Your Next Ride

A full-stack Used Car Listing Portal built with **React.js, Vite, Node.js, Express.js, and MongoDB** (with automatic persistent local JSON & `localStorage` demo fallback when MongoDB credentials are unavailable).

## Tech Stack
- **Frontend:** React 19, Vite, React Router DOM, Lucide Icons, Modular CSS
- **Backend:** Node.js, Express.js, Mongoose, JWT (`jsonwebtoken`), `bcryptjs`
- **Database:** MongoDB (via `MONGODB_URI`) or automatic persistent local JSON store (`server/data/db.json`) + client-side `localStorage` demo fallback

## Quick Start (Windows / VS Code)

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Configure environment (optional for MongoDB):**
   Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` if you have a local or Atlas MongoDB instance. If omitted or unavailable, the backend automatically persists all data in `server/data/db.json`.

3. **Run both Frontend & Backend together:**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

4. **Or run separately:**
   ```bash
   npm run server
   npm run client
   ```

## Demonstration Credentials (Demo Only)
- **Buyer:** `buyer@carbazaar.com` / `Buyer123`
- **Seller:** `seller@carbazaar.com` / `Seller123`
- **Admin:** `admin@carbazaar.com` / `Admin123`
