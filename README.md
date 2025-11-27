# Car Parking Slot Booking System

A full-stack web application for booking car parking slots built with ReactJS and NodeJS.

## Features

### User Features
- 🔐 User registration and authentication
- 🔍 Browse available parking slots
- 🅿️ Filter slots by zone, vehicle type, and availability
- 📅 Book parking slots with date/time selection
- 📱 View and manage bookings
- ❌ Cancel bookings
- 💳 Payment integration ready

### Admin Features
- ➕ Add new parking slots
- ✏️ Edit parking slot details
- 🗑️ Delete parking slots
- 📊 View all bookings
- ✅ Update booking status

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Project Structure

```
MNM-mini-proj/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── slotController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── ParkingSlot.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── slotRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── BookingModal.js
    │   │   ├── BookingModal.css
    │   │   ├── Navbar.js
    │   │   ├── Navbar.css
    │   │   ├── SlotCard.js
    │   │   └── SlotCard.css
    │   ├── pages/
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminDashboard.css
    │   │   ├── Auth.css
    │   │   ├── Home.js
    │   │   ├── Home.css
    │   │   ├── Login.js
    │   │   ├── MyBookings.js
    │   │   ├── MyBookings.css
    │   │   ├── ParkingSlots.js
    │   │   ├── ParkingSlots.css
    │   │   └── Register.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    ├── .env
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parking-booking
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Parking Slots
- `GET /api/slots` - Get all parking slots
- `GET /api/slots/:id` - Get single parking slot
- `POST /api/slots` - Create parking slot (Admin)
- `PUT /api/slots/:id` - Update parking slot (Admin)
- `DELETE /api/slots/:id` - Delete parking slot (Admin)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings/my-bookings` - Get user bookings (Protected)
- `GET /api/bookings` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

## Usage

### For Users
1. Register/Login to your account
2. Browse available parking slots
3. Use filters to find suitable slots
4. Click "Book Now" on desired slot
5. Fill in vehicle details and time
6. Confirm booking
7. View bookings in "My Bookings" page

### For Admin
1. Login with admin credentials
2. Access admin dashboard
3. Add/Edit/Delete parking slots
4. View and manage all bookings
5. Update booking statuses

## Future Enhancements

- 🔄 Payment gateway integration (Stripe/Razorpay)
- 📧 Email notifications
- 📊 Analytics dashboard
- 🔔 Real-time notifications
- 📍 Location-based search
- 🌙 Dark mode
- 📱 Mobile app (React Native)

## Contributing

Feel free to fork this project and submit pull requests.

## License

ISC

## Contact

For any queries, please reach out to the development team.
