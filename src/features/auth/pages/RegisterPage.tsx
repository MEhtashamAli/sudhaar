import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, Loader2, Building2, CreditCard } from "lucide-react"; // Added CreditCard icon
import AuthLayout from "../../../components/layout/AuthLayout";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("citizen");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("authToken", "demo-token");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join the movement for a better city today."
    >
      <form onSubmit={handleRegister} className="space-y-5 max-w-md">
        
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              required
              placeholder="e.g. Ali Khan"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="email" 
              required
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* CNIC Field (New) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">CNIC Number</label>
          <div className="relative">
            <CreditCard className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              required
              placeholder="35202-1234567-1"
              maxLength={15} // Standard 13 digits + 2 dashes
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Contact & Role Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input 
                type="tel" 
                placeholder="0300-1234567"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">I am a...</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900 appearance-none cursor-pointer"
              >
                <option value="citizen">Citizen</option>
                <option value="ngo">NGO</option>
                <option value="official">Govt Official</option>
              </select>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="password" 
              required
              placeholder="Create a strong password"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-900"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 mt-2"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Create Account"}
          {!isLoading && <ArrowRight className="h-5 w-5" />}
        </button>

        {/* Footer Link */}
        <p className="text-center text-slate-500 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign in
          </Link>
        </p>

      </form>
    </AuthLayout>
  );
}