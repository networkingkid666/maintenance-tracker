# Maintenance & Repair Tracker

A modern web application for tracking maintenance and repair issues with a beautiful UI/UX design.

## Features

- 🔐 **Authentication**: Login system with email and password
- 📊 **Dashboard**: Overview with statistics tabs and pie chart visualization
- 🔧 **Issues Management**: Full CRUD operations for maintenance issues
- 📄 **Reports Management**: Full CRUD operations for reports
- 👤 **Profile Management**: User profile viewing and editing
- ⚙️ **Settings**: Application settings page
- 🎨 **Modern UI**: Beautiful design with white and mid-blue color scheme
- ✨ **Animations**: Smooth transitions and animations using Framer Motion
- 📱 **Responsive**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Recharts (charts)
- React Router

### Backend
- Node.js + Express
- TypeScript
- JWT Authentication (ready for implementation)

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. The server will run on `http://localhost:5000`

## Demo Login

For the demo version (localStorage):
- **Email**: `admin@example.com`
- **Password**: Any password works for demo purposes

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API and data services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   └── server.ts       # Express server
│   └── package.json
└── README.md
```

## Features in Detail

### Dashboard
- Three horizontal tabs showing Total, Pending, and Solved issues
- Interactive pie chart showing issue distribution
- Recent issues list with status badges
- Smooth animations and transitions

### Sidebar Navigation
- Collapsible sidebar with toggle button
- Navigation items: Dashboard, Issues, Reports, Profile
- Settings and Logout at the bottom
- Smooth slide animations

### Issues Management
- Create, Read, Update, Delete operations
- Search and filter functionality
- Status and priority management
- Beautiful card-based layout

### Reports Management
- Full CRUD operations
- Type categorization (Maintenance, Repair, Inspection, Other)
- Date management
- Search and filter capabilities

### Profile Management
- View and edit user profile
- Update preferences (theme, notifications)
- Avatar support

## Color Scheme

- **Primary**: Mid-blue (#4A90E2)
- **Background**: White (#FFFFFF)
- **Accent**: Various shades of blue and complementary colors

## Development

The application uses localStorage for data persistence in the demo version. The backend structure is ready for future database integration.

## License

This project is open source and available for use.

