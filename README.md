# Voyage - Travel Memory App

A full-stack React Native (Expo) application for storing and organizing travel memories, built with Node.js, Express, MongoDB.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Memory Management**: Add, view, edit, and delete travel memories
- **Photo Storage**: Base64-encoded images stored in MongoDB
- **Year-Month Organization**: Memories organized in folder-like structure
- **Search & Filter**: Find memories by title, place, or date
- **Custom Styled Alerts**: All alert dialogs use a beautiful, consistent modal for better UX
- **Safe Area Support**: All screens use SafeAreaView to avoid content hiding under the status bar
- **Improved Navigation**: No duplicate alerts or navigation issues when adding multiple memories
- **Cross-Platform**: Works on iOS and Android

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- RESTful API endpoints
- JWT authentication middleware
- MongoDB Atlas for data storage
- Password encryption with bcrypt
- Input validation and security

### Frontend (React Native + Expo)
- Expo Router for navigation
- Authentication context for state management
- API service layer for HTTP requests
- Image picker for photo selection
- CustomAlert modal for all alert dialogs
- SafeAreaView for all screens

## 📁 Project Structure

```
voyage/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Memory.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── memories.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── add.tsx
│       └── profile.tsx
├── contexts/
│   └── AuthContext.tsx
├── utils/
│   └── api.ts
├── package.json
└── babel.config.js
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Expo CLI

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment configuration:**
```bash
# Copy .env file and update values
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string and JWT secret
```

3. **Start the backend server:**
```bash
npm run dev
# Server will run on http://localhost:5000
```

### Frontend Setup

1. **Install dependencies:**
```bash
cd .. # Return to root directory
npm install
```

2. **Start the development server:**
```bash
npm start
```

3. **Run on device/simulator:**
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
FRONTEND_URL=http://localhost:8081
NODE_ENV=development
```

### Frontend
The frontend communicates with the backend via HTTP requests. Update the API_BASE_URL in `utils/api.ts` if the backend is hosted on a different URL.

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

### Memories
- `GET /memories` - Fetch all memories (with search/filter)
- `POST /memories` - Create new memory
- `PUT /memories/:id` - Update memory
- `DELETE /memories/:id` - Delete memory

All memory endpoints require authentication (JWT token).

## 🎨 Components & Styling

- **Expo Vector Icons**: Icon library
- **Custom Components**: Reusable UI components with consistent styling
- **CustomAlert Modal**: Beautiful, animated alert dialogs for all user feedback
- **SafeAreaView**: Ensures content is always visible and not hidden by device UI
- **Responsive Design**: Works across different screen sizes

## 📝 Usage

1. **Signup/Login**: Create account or sign in
2. **Dashboard**: View organized memories
3. **Add Memory**: Create new travel memories (with instant feedback and smooth navigation)
4. **Search/Filter**: Find specific memories
5. **Profile**: Manage account and logout

## 🚧 Development Notes

### Photo Handling
- Images are stored as Base64 strings in MongoDB
- Photo picker integration with expo-image-picker (placeholder implemented)
- Support for both photo library and camera

### Date Handling
- Date pickers for selecting travel dates
- Date validation and formatting
- Year/month grouping for organization

### Authentication Flow
- JWT tokens stored in AsyncStorage
- Automatic redirect based on authentication state
- Secure logout with token cleanup
- All authentication and error alerts use the new CustomAlert modal

## 🔄 Future Enhancements

- [ ] Real photo picker implementation
- [ ] Memory details/edit screens
- [ ] Map integration for location links
- [ ] Memory sharing features
- [ ] Offline support
- [ ] Image optimization and compression
- [ ] Push notifications
- [ ] Dark theme support
- [ ] More customizable alert/modal options

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Voyage** - Your personal travel memory keeper, built with modern technologies for seamless mobile experience.
