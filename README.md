# Voyage - Travel Memory App

A full-stack mobile application for capturing and organizing travel memories, built with React Native (Expo) and Node.js. Users can create, store, and manage their travel experiences with photos, dates, locations, and descriptions in a beautiful, user-friendly interface.

## 🚀 Features

- **User Authentication**: Secure signup and login with JWT-based authentication
- **Memory Management**: Full CRUD operations for travel memories with instant feedback
- **Photo Upload**: Integrated image picker with cropping, rotation, and flipping features
- **Location Integration**: Clickable location links that redirect to Google Maps
- **Date Tracking**: Comprehensive date handling with from/to date validation
- **Search & Filter**: Powerful search by title, place name, or location; filter by year and month
- **Organized View**: Memories displayed in collapsible year/month folder structure
- **Bulk Deletion**: Delete all memories with one click
- **Local Storage Download**: Download memories to device storage
- **Custom Alerts**: Consistent, animated modal alerts for all user interactions
- **Cross-Platform**: Runs on both iOS and Android with Expo
- **Offline Storage**: JWT tokens stored securely in AsyncStorage
- **Data Validation**: Comprehensive validation on both client and server sides
- **Security**: Password hashing, rate limiting, CORS protection, and security headers

## 🛠️ Tech Stack

### Frontend (React Native + Expo)
- **Expo SDK 53**: Latest Expo for React Native development
- **React 19 & React Native 0.79.6**: Core React Native framework
- **Expo Router**: File-based routing for navigation
- **TypeScript**: Full type safety
- **Context API**: Authentication state management
- **Axios**: HTTP client for API calls
- **Expo Image Picker**: Photo selection from camera or gallery
- **React Native Toast Message**: Toast notifications for feedback
- **AsyncStorage**: Persistent local storage for auth tokens

### Backend (Node.js + Express + MongoDB)
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for REST API
- **MongoDB (Atlas)**: NoSQL database with Mongoose ODM
- **JWT (jsonwebtoken)**: Authentication tokens
- **Bcrypt**: Password hashing
- **Express Validator**: Request validation
- **Rate Limiting**: DDOS protection with express-rate-limit
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Nodemon**: Development server with auto-reload

### Deployment & DevOps
- **MongoDB Atlas**: Cloud database hosting
- **VSCode**: Development environment
- **Expo CLI**: Building and testing
- **EAS Build (implied)**: Over-the-air updates and builds

## 📁 Project Structure

```
voyage/
├── backend/                          # Node.js Express API server
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                   # User mongoose schema
│   │   └── Memory.js                 # Memory mongoose schema
│   ├── routes/
│   │   ├── auth.js                   # Authentication endpoints
│   │   └── memories.js               # Memory CRUD endpoints
│   ├── .env                          # Environment variables (create manually)
│   ├── package-lock.json
│   ├── package.json
│   └── server.js                     # Main server entry point
├── app/                              # React Native frontend
│   ├── _layout.tsx                   # Root layout with navigation
│   ├── index.tsx                     # Splash/landing screen
│   ├── auth/
│   │   ├── _layout.tsx               # Auth navigation layout
│   │   ├── login.tsx                 # Login screen
│   │   └── signup.tsx                # Signup screen
│   ├── tabs/
│   │   ├── _layout.tsx               # Tab navigation layout
│   │   ├── index.tsx                 # Memories list/dashboard
│   │   ├── add.tsx                   # Add memory screen
│   │   └── profile.tsx               # User profile screen
│   └── memory/
│       ├── _layout.tsx               # Memory detail navigation
│       └── [id].tsx                  # Dynamic memory detail view
├── contexts/
│   └── AuthContext.tsx               # Authentication context provider
├── utils/
│   └── api.ts                        # API service layer
├── components/
│   └── CustomAlert.tsx               # Custom modal alert component
├── assets/
│   ├── images/                       # App images and icons
│   └── fonts/                        # Custom fonts
├── ios/                              # iOS Xcode project
├── android/                          # Android Gradle project
├── package.json                      # Frontend dependencies
├── app.json                          # Expo configuration
├── babel.config.js                   # Babel configuration
├── tsconfig.json                     # TypeScript configuration
├── eslint.config.js                  # ESLint configuration
└── README.md                         # This file
```

## 🔧 Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB Atlas** account (for database)
- **Expo CLI**
- **Android Studio** (for Android emulator) or **Xcode** (for iOS simulator)

## 🚀 Setup Instructions

### 1. Backend Setup

**Navigate to backend directory:**
```bash
cd backend
```

**Install backend dependencies:**
```bash
npm install
```

**Environment Configuration:**
Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/voyage?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8081
```

**Note:** The `FRONTEND_URL` should match your frontend development URL. Default is `http://localhost:8081` for Expo web development.

**Start the backend server:**
```bash
npm run dev
```
The server will start on `http://localhost:5000` (or your configured PORT).

**Verify backend:**
Visit `http://localhost:5000` in your browser (you should see a 404 - route not found error, confirming the server is running).

### 2. Frontend Setup

**Navigate to root directory:**
```bash
cd .. # Return to project root
```

**Install frontend dependencies:**
```bash
npm install
```

**Configure API URL:**
Update `API_BASE_URL` in two files to match your backend server's address:

- `contexts/AuthContext.tsx` (line ~12)
- `utils/api.ts` (line ~3)

**Network Configuration:**
- **Expo Simulator:** Use `http://192.168.1.xxx:5000` (your computer's IP address)
- **Android Emulator:** Use `http://10.0.2.2:5000` (Android emulator's localhost)
- **iOS Simulator:** Use `http://192.168.1.xxx:5000` (your computer's IP address)
- **Physical Device:** Use `http://your-computer-ip:5000`

**Start the development server:**
```bash
npm start
```

**Run on device/simulator:**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

**Build for production:**
```bash
npx expo build:android
npx expo build:ios
```

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-super-secret-key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:8081` |

## 📡 API Endpoints

### Authentication
All memory endpoints require JWT authentication.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register new user | No |
| POST | `/auth/login` | Login user | No |

**Signup Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Memories
All endpoints require Bearer token authentication: `Authorization: Bearer <jwt-token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/memories` | Get all user's memories (with optional search/filter) |
| POST | `/memories` | Create new memory |
| PUT | `/memories/:id` | Update memory |
| DELETE | `/memories/:id` | Delete specific memory |
| DELETE | `/memories` | Delete all user's memories |

**Memory Object Schema:**
```json
{
  "_id": "string",
  "title": "Trip to Paris",
  "description": "Amazing vacation...",
  "placeName": "Paris, France",
  "locationLink": "https://maps.google.com/place?id=...",
  "fromDate": "2024-01-15",
  "toDate": "2024-01-20",
  "photo": "base64-encoded-image-string",
  "user": "user-id",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z",
  "year": 2024,
  "month": 0,
  "monthName": "January",
  "dateRange": "Jan 15, 2024 - Jan 20, 2024"
}
```

**Query Parameters for GET /memories:**
- `search`: Search in title, placeName, description
- `year`: Filter by year
- `month`: Filter by month (0-11)

## 🎨 Key Components

- **AuthContext**: Provides authentication state across the app
- **CustomAlert**: Reusable modal for confirmations and notifications
- **Memory Detail Screen**: Dynamic route for viewing/editing memories
- **Tab Navigation**: Bottom tabs for main app sections
- **Date Picker**: Native date selection components
- **Image Picker**: Expo image selection from gallery/camera

## 📝 Usage Guide

1. **Setup**: Follow installation steps above
2. **Register**: Create account on signup screen
3. **Login**: Authenticate with email/password
4. **Dashboard**: View organized memories in year/month sections
5. **Add Memory**: Use image picker, enter details, save memory
6. **Search/Filter**: Use search bar and year/month filters
7. **Profile**: View account info and logout option

## 🔄 Application Flow

1. **Splash Screen** → Auto-navigation based on auth state
2. **Auth Screens** → Signup/Login with form validation
3. **Tab Navigation**:
   - **Home**: Memories dashboard with search/filter
   - **Add**: Memory creation form with fields validation
   - **Profile**: User management and logout
4. **Memory Details**: View full memory with edit/delete options
5. **Authentication State**: Persistent login with automatic redirects

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: 7-day expiration with secure signing
- **Input Validation**: Express validator on all routes
- **Rate Limiting**: 100 requests per 15-minute window
- **CORS Protection**: Configured for allowed origins
- **Security Headers**: Helmet middleware for production
- **Data Sanitization**: Mongoose pre-save hooks

## 🧪 Testing

**Backend API Testing:**
- Use Postman or similar to test endpoints
- Include JWT token in Authorization header for protected routes

**Frontend Testing:**
- Run `npm start` and use Expo Go app for mobile testing
- Test on both iOS and Android devices/simulators

## 🚧 Known Issues & Limitations

- **Image Storage**: Photographs stored as base64 strings (consider optimization)
- **Memory Organization**: Limited to year/month grouping
- **Location Links**: Basic URL validation (no embed/link preview)
- **Offline Support**: No offline memory creation/caching
- **Push Notifications**: Not implemented

## 📱 Development Notes

**Expo Router Structure:**
- `/app/_layout.tsx`: Root layout
- `/app/(auth)`: Authentication screens (group)
- `/app/(tabs)`: Main app screens (group)
- `/app/memory/[id].tsx`: Dynamic memory routes

**Database Schema:**
- **Users**: Email, hashed password, name, timestamps
- **Memories**: All memory fields, owner reference, indexes

**State Management:**
- Auth state managed via Context API
- API calls handled through service layer
- Form validation with client-side checks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -am 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Create a Pull Request

**Code Quality:**
- Follow existing TypeScript and React Native patterns
- Add proper error handling
- Test on multiple platforms
- Update documentation as needed

---

**Voyage** - Preserve your travel memories beautifully on mobile. Built with modern React Native and Node.js technologies for seamless cross-platform experience.

📞 **Support**: Create issues on GitHub for bug reports or feature requests.
