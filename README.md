# Music Library Micro Frontend Assignment

This project demonstrates a working `Micro Frontend architecture` using React and Vite Module Federation, with role-based authentication, `Express.js backend`, and Tailwind styling.

## 🖥️ Apps

- **backend**: Express.js API server with cookie based JWT authentication and RESTful endpoints
- **main-container**: The host app with authentication (admin/user) and routing
- **micro-frontend**: The remote micro frontend exposed via Module Federation

## 🚀 How to Run Locally

### Clone the repo
```bash
git clone https://github.com/shashwatpuri/fp-assignment.git
cd fp-assignment
```

### Start Backend (API Server)
```bash
cd backend
npm install
npm run dev
```
This runs the backend API on http://localhost:3000

### Start micro-frontend (Remote App)
This runs the remote micro frontend on http://localhost:4173
NOTE: Since Micro Frontend is referenced via remoteEntry.js, it is necessary to build and run it in preview mode.
```bash
cd ../micro-frontend
npm install
npm run build
npm run preview
```

### Start main-container (Host App)
```bash
cd ../main-container
npm install
npm run dev
```
This runs the host application on http://localhost:5173

## 🔧 Environment Files Setup

### Backend Environment
Create a `.env` file in the `backend` directory:
```env
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
PORT=3000
```

### Main Container Environment
Create a `.env` file in the `main-container` directory:
```env
VITE_REMOTE_MODULE_URL=http://localhost:4173
VITE_API_BASE_URL=http://localhost:3000
```

### Micro Frontend Environment
Create a `.env` file in the `micro-frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🌐 Deployment details

All three apps are deployed separately, Vercel for frontend and Railway for backend from the same repo:

| App | URL |
|-----|-----|
| Main App | https://fp-assignment.vercel.app/ |
| Music Library (remote) | https://fp-assignment-micro-frontend.vercel.app/ |
| Backend API | https://fp-assignment-production.up.railway.app/ |

In `main-container/vite.config.ts`, the remote is referenced like this:
```typescript
remotes: {
  microfrontend: `${remoteModuleUrl}/assets/remoteEntry.js`
}
```

## 🔐 Credentials for Demo

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `admin123` |
| User | `test@gmail.com` | `test123` |

These credentials (password is hashed) are stored in `backend/src/lib/data/users.json` (file based database)

## 🧠 Explanation: Micro Frontend & Role-Based Auth

### Micro Frontend:
- **micro-frontend** exposes the `MusicLibrary` component via `remoteEntry.js` using Vite Module Federation
- **main-container** loads this remote component at runtime and renders it as part of its UI
- Uses `@originjs/vite-plugin-federation` for modern, fast module federation

### Role-Based Authentication:
- Auth is handled in **main-container** using React Context API
- On login, a JWT token is set as a cookie, containing user info and role
- The role is extracted from the token and passed as a prop to the remote `MusicLibrary` component
- The micro frontend uses this prop to conditionally render admin-only features (Add/Delete buttons)

### Backend Integration:
- **Express.js server** provides RESTful API endpoints for songs and users
- **JWT middleware** handles authentication and authorization
- **CORS configuration** allows cross-origin requests from frontend apps
- **File-based data storage** with JSON files for songs and users

## 🎨 Features

### Music Library (micro-frontend)
- **Search & Filter**: Real-time filtering by title, artist, album
- **Sort & Group**: Sort by any field, group by artist or album
- **Admin Controls**: Add/delete songs (admin only)
- **Modern UI**: Glassmorphism design with Tailwind CSS

### Technical Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom glassmorphism components
- **Module Federation**: Vite plugin for micro frontend architecture
- **Backend**: Express.js, JWT, bcrypt for password hashing
- **Build Tools**: Vite for fast development and optimized builds

## 📁 Project Structure

```
fp-assignment/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── lib/data/       # JSON data files (acting as database)
│   │   ├── middleware/     # JWT auth middleware
│   │   └── routes/         # API endpoints
├── main-container/         # Host React application
│   ├── src/
│   │   ├── contexts/       # Auth context
│   │   ├── pages/          # Route components
│   │   └── providers/      # Context providers
└── micro-frontend/         # Remote music library
    ├── src/
    │   ├── components/     # Music library components
    │   └── pages/          # Music library page
```
