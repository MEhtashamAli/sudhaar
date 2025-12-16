import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- Layouts ---
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// --- Auth Pages ---
import LandingPage from "./features/auth/pages/LandingPage";
import LoginPage from "./features/auth/pages/LoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";

// --- Public / Legal Pages ---
import PrivacyPage from "./features/public/pages/PrivacyPage";
import TermsPage from "./features/public/pages/TermsPage";
import ContactPage from "./features/public/pages/ContactPage";

// --- Core Feature Pages ---
import Dashboard from "./features/dashboard/pages/Dashboard";
import MyReports from "./features/issues/pages/MyReports"; // <--- My Reports Page
import DonationPage from "./features/donations/pages/DonationPage"; // <--- Donation Page (Next to build)
import TransparencyPage from "./features/transparency/pages/TransparencyPage"; // <--- Transparency Dashboard
import ResolvedArchivePage from "./features/transparency/pages/ResolvedArchivePage"; // <--- Resolved Archive

// --- Placeholder for Map Feature (To be built later) ---
const MapView = () => (
  <div className="p-8 max-w-7xl mx-auto">
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 h-[600px] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl" role="img" aria-label="Map">🗺️</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-800">Live Map View</h1>
      <p className="text-slate-500 mt-2 max-w-md">
        This feature is under construction. It will display a full-screen interactive map of all reported issues.
      </p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- PUBLIC ROUTES (No Login Required) --- */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Legal & Support Pages */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* --- PROTECTED ROUTES (Login Required) --- */}
        {/* 1. First, check if user is logged in (ProtectedRoute) */}
        {/* 2. Then, wrap content in the sidebar/navbar (DashboardLayout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* The "Index" of the dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Citizen Reporting & Tracking */}
            <Route path="/reports" element={<MyReports />} /> {/* <--- Track My Issues */}
            
            {/* Donations */}
            <Route path="/donate" element={<DonationPage />} />
            
            {/* Transparency & Archive */}
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/archive" element={<ResolvedArchivePage />} /> {/* <--- Historical Archive */}
            
            {/* Map View */}
            <Route path="/map" element={<MapView />} />
            
          </Route>
        </Route>

        {/* --- CATCH-ALL ROUTE (404) --- */}
        {/* If user types a random URL, send them back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;