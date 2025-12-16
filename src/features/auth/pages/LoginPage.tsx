import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import AuthLayout from "../../../components/layout/AuthLayout"; 

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize hook
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // 1. Set a fake auth token so ProtectedRoute lets us in
      localStorage.setItem("authToken", "demo-token");
      // 2. Redirect to Dashboard
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Please enter your details to sign in."
    >
      <form onSubmit={handleLogin} className="space-y-6 max-w-md">
        
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="email" 
              required
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700">Password</label>
            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">Forgot password?</a>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
          {!isLoading && <ArrowRight className="h-5 w-5" />}
        </button>

        {/* Footer Link */}
        <p className="text-center text-slate-500 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Sign up for free
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}