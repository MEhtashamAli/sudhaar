# Quick Start Guide

## ✅ Setup Complete!

Your Sudhaar application is now fully connected with:
- **Frontend**: React + TypeScript + Vite (running on http://localhost:5173)
- **Backend**: Django REST API (running on http://localhost:8000)

## 🌐 Access Your Application

1. **Frontend**: Open your browser and go to:
   ```
   http://localhost:5173
   ```

2. **Backend API**: Available at:
   ```
   http://localhost:8000/api/
   ```

3. **Admin Panel**: (Optional - create superuser first)
   ```
   http://localhost:8000/admin/
   ```

## 🚀 Getting Started

### 1. Create Your First Account

1. Go to http://localhost:5173
2. Click "Sign up for free" or go to `/register`
3. Fill in your details:
   - Full Name
   - Email
   - CNIC Number
   - Phone (optional)
   - Role (Citizen, NGO, or Govt Official)
   - Password
4. Click "Create Account"

### 2. Login

1. Go to `/login`
2. Enter your email and password
3. You'll be redirected to the dashboard

### 3. Report an Issue

1. From the dashboard, click "Report Issue"
2. Fill in the issue details:
   - Category (Roads, Sanitation, etc.)
   - Title and Description
   - Location (use the map to pinpoint)
   - Upload an image (optional)
3. Submit your report

### 4. View Your Reports

- Go to `/reports` to see all issues you've reported
- Track their status and updates

## 📡 API Endpoints

All API endpoints are available at `http://localhost:8000/api/`:

- **Auth**: `/api/auth/register/`, `/api/auth/login/`
- **Issues**: `/api/issues/`
- **Campaigns**: `/api/campaigns/`
- **Donations**: `/api/donations/`
- **Dashboard**: `/api/dashboard/stats/`

## 🛠️ Running the Servers

### Option 1: Use the Start Script (Windows)
```bash
start-dev.bat
```

### Option 2: Manual Start

**Backend:**
```bash
cd backend
python manage.py runserver
```

**Frontend:**
```bash
npm run dev
```

## 🔧 Troubleshooting

### Backend not starting?
- Make sure dependencies are installed: `pip install -r backend/requirements.txt`
- Run migrations: `cd backend && python manage.py migrate`

### Frontend not connecting to backend?
- Check that backend is running on port 8000
- Verify CORS settings in `backend/sudhaar_backend/settings.py`
- Check browser console for errors

### Can't login?
- Make sure you've registered an account first
- Check that the backend is running
- Verify your email and password are correct

## 📝 Next Steps

1. **Create a superuser** (for admin access):
   ```bash
   cd backend
   python manage.py createsuperuser
   ```

2. **Explore the features**:
   - Report issues
   - View dashboard statistics
   - Browse campaigns (if any NGOs have created them)
   - Check transparency reports

3. **Customize**:
   - Update API configuration in `src/config/api.ts`
   - Modify backend settings in `backend/sudhaar_backend/settings.py`

## 🎉 You're All Set!

Your application is ready to use. Open http://localhost:5173 in your browser and start exploring!

