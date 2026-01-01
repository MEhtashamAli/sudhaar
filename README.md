# Sudhaar - Civic Issue Reporting Platform

A modern civic issue reporting platform built with React + TypeScript + Vite frontend and Django REST Framework backend.

## Features

- 🚨 **Issue Reporting**: Report civic issues with images, location, and categories
- 📊 **Dashboard**: Track issues, view statistics, and monitor progress
- 💰 **Donations**: Support campaigns from verified NGOs
- 🔍 **Transparency**: View financial reports and resolved issue archives
- 👥 **User Roles**: Support for Citizens, NGOs, and Government Officials
- 🔐 **Authentication**: Secure JWT-based authentication

## Project Structure

```
sudhaar-main/
├── backend/              # Django REST API
│   ├── api/             # API app with models, views, serializers
│   ├── sudhaar_backend/ # Django project settings
│   └── requirements.txt # Python dependencies
├── src/                 # React frontend
│   ├── features/        # Feature modules
│   ├── components/      # Reusable components
│   └── ...
└── README.md
```

## Quick Start

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server:**
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/api/`

For detailed backend documentation, see [backend/README.md](backend/README.md)

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/refresh/` - Refresh access token

### Issues
- `GET /api/issues/` - List all issues
- `POST /api/issues/` - Create new issue
- `GET /api/issues/{id}/` - Get issue details
- `POST /api/issues/{id}/upvote/` - Upvote an issue
- `POST /api/issues/{id}/update_status/` - Update issue status

### Campaigns
- `GET /api/campaigns/` - List all campaigns
- `POST /api/campaigns/` - Create campaign (NGO only)
- `GET /api/campaigns/{id}/` - Get campaign details

### Donations
- `GET /api/donations/` - List donations
- `POST /api/donations/` - Create donation

See [backend/README.md](backend/README.md) for complete API documentation.

## Connecting Frontend to Backend

To connect your React frontend to the Django backend:

1. **Create an API configuration file** (e.g., `src/config/api.ts`):
   ```typescript
   export const API_BASE_URL = 'http://localhost:8000/api';
   ```

2. **Update your API calls** to use the backend endpoints instead of mock data

3. **Handle JWT tokens** in your authentication flow:
   - Store tokens from login/register responses
   - Include `Authorization: Bearer <token>` header in API requests

## Development

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend
- `python manage.py runserver` - Start development server
- `python manage.py makemigrations` - Create migrations
- `python manage.py migrate` - Apply migrations
- `python manage.py createsuperuser` - Create admin user

## Technologies

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Leaflet (Maps)

### Backend
- Django 5.0
- Django REST Framework
- JWT Authentication
- SQLite (development)
- Pillow (image handling)

## License

This project is part of the Sudhaar platform.
