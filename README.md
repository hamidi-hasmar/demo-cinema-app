# Cinema Booking App

Cinema Booking App is a full-stack movie ticket booking application built for the developer interview assignment. The app allows users to browse movies, view movie details, select showtimes, reserve seats, add food and beverages, review the booking summary, and complete a mock card payment. The main real-time requirement is implemented in the seat booking flow, where seat availability updates live across multiple users.

## Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- Native WebSocket support using Node HTTP upgrade handling

### Frontend

- Expo
- React Native
- Expo Router
- TypeScript
- React Native Web support for browser testing

## Application Features

- Movie listing and movie detail screens
- Movie CRUD API
- Showtime selection by location, cinema hall, date, and time
- Cinema seat layout with live seat locking
- Food and beverage add-on selection
- Booking summary with ticket and F&B totals
- Payment method screen
- Card payment form
- Mock payment success screen
- Booking transaction saved to the database

## Live Seat Update Feature

The key real-time feature is the cinema seat booking flow. When one user selects a seat, the seat is locked immediately and other users viewing the same showtime will see that seat become unavailable.

This is implemented using WebSocket.

### How It Works

1. The user opens the booking page and selects a showtime.
2. The frontend opens a WebSocket connection to the backend:

```txt
ws://localhost:5000/api/showtimes/:showtimeId/seats/ws?clientId=...
```

3. The backend sends the current locked seats to the client.
4. When a user selects a seat, the frontend calls:

```txt
POST /api/showtimes/:showtimeId/seats/:seatNumber/lock
```

5. The backend saves the seat lock in the database.
6. The backend broadcasts the latest seat lock list to every WebSocket client connected to the same showtime.
7. Other users' screens update immediately and show the seat as unavailable.

When the user unselects their own seat, the frontend calls:

```txt
DELETE /api/showtimes/:showtimeId/seats/:seatNumber/lock
```

The backend removes the lock and broadcasts the updated seat list again.

### Important Files

- Backend WebSocket server: `backend/src/modules/seats/seat.websocket.ts`
- Backend seat lock logic: `backend/src/modules/seats/seat.service.ts`
- Backend seat routes: `backend/src/modules/seats/seat.routes.ts`
- Frontend WebSocket client: `frontend/src/features/movies/api/movie-api.ts`
- Frontend seat hook: `frontend/src/features/movies/hooks/use-seat-locks.ts`
- Frontend booking screen: `frontend/src/features/movies/screens/movie-booking-screen.tsx`

## How To Run The Application

Run the backend and frontend in separate terminals.

### 1. Backend Setup

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The backend runs on:

```txt
http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Expo will show options to run the app on Android, iOS, or web.

For Android emulator:

```bash
npm run android
```

For web:

```bash
npm run web
```

## Android Emulator Notes

If running on Android Studio emulator, the app needs to reach the backend running on your computer. The frontend code detects the Expo host and builds the API URL automatically.

If needed, set the backend URL manually:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:5000
```

For Expo on a physical device, use your computer's local network IP address instead of `localhost`.

## Testing Live Seat Updates

To test the live seat update feature:

1. Start the backend.
2. Start the frontend.
3. Open the app in Android emulator.
4. Open a second client, such as the web app in a browser.
5. Go to the same movie, same location, same hall, same date, and same time.
6. Select a seat in Client A.
7. Client B should immediately show that seat as unavailable.
8. Unselect the seat in Client A.
9. Client B should see the seat become available again.

## Main API Endpoints

### Movies

```txt
GET    /api/movies
GET    /api/movies/:id
POST   /api/movies
PATCH  /api/movies/:id
PUT    /api/movies/:id
DELETE /api/movies/:id
GET    /api/movies/:id/booking-options
```

### Seats

```txt
GET    /api/showtimes/:showtimeId/seats
POST   /api/showtimes/:showtimeId/seats/:seatNumber/lock
DELETE /api/showtimes/:showtimeId/seats/:seatNumber/lock
WS     /api/showtimes/:showtimeId/seats/ws
```

### Food And Beverage

```txt
GET /api/concessions
```

### Booking Transactions

```txt
POST /api/bookings/transactions
```

## Payment Flow

The payment flow is a mock implementation. It does not integrate with a real payment gateway. When the user submits card payment details, the backend saves a booking transaction in the SQLite database with status `PAID`.

This keeps the focus on the assignment's main requirement: live seat locking during booking.
