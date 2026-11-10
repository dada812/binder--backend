# Binder Backend

TypeScript REST API for a collectibles-tracking app. Built with Fastify and Zod.
Searches the public Scryfall card database and manages a user wishlist.

## Endpoints
- GET /health: service status
- GET /cards/search?q=<query>: search cards (name, image, USD price)
- GET /wishlist: list wishlist items
- POST /wishlist: add an item ({ id, name }); returns 409 if it already exists

## Run locally
npm install
npm run dev
Server runs at http://localhost:3000

## What I learned
- Validating input with Zod and returning proper HTTP status codes (400, 404, 409, 502)
- Handling failures from a third-party API without crashing the server

## Next steps
- Persist data in a database (PostgreSQL)
- User accounts and authentication
- Trade proposals between users
- SwiftUI iOS client
