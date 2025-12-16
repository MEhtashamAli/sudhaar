import { useState } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router-dom";
import { 
  Bell, Menu, X 
} from "lucide-react";
import Footer from "./Footer"; 
import logoImg from "../../assets/sudhaar_logo.png";

const TopNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Transparency", path: "/transparency" },
    { label: "NGO", path: "/donate" }, // <--- RENAMED TO NGO
    { label: "My Reports", path: "/reports" }, 
  ];

  // Close mobile menu when route changes
  if (isMobileMenuOpen && location.pathname) {
    // This is a simple way to auto-close, or use useEffect on location
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white h-16 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* --- LEFT: LOGO --- */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <img 
                src={logoImg} 
                alt="Sudhaar Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => e.currentTarget.style.display = 'none'} // Fallback if image missing
            />
            <span className="text-xl font-black tracking-tight text-blue-600"> 
                SUDHAAR
            </span>
          </Link>

          {/* --- CENTER: DESKTOP NAV --- */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-bold h-16 border-b-2 transition-all duration-200 
                   ${isActive
                      ? "text-blue-600 border-blue-600" 
                      : "text-slate-500 border-transparent hover:text-blue-600 hover:border-blue-100" 
                    }`
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* --- RIGHT: ACTIONS & MOBILE TOGGLE --- */}
          <div className="flex items-center gap-4">
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
            </button>

            {/* Desktop Profile */}
            <div className="hidden md:flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-700 leading-none">Ali Khan</span>
                <span className="text-xs text-slate-500 mt-1">Citizen</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm">
                AK
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-2">
          <div className="px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            
            {/* Mobile Profile Section */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-3 px-2">
               <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  AK
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-800">Ali Khan</p>
                  <p className="text-xs text-slate-500">Citizen Account</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col"> 
      <TopNavbar />
      
      <main className="pt-16 flex-grow"> 
        <Outlet />
      </main>
      
      <Footer /> 
    </div>
  );
}