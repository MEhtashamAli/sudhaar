import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageSrc?: string; // Made optional
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full flex bg-white font-sans selection:bg-blue-100">
      
      {/* LEFT: DECORATIVE PANEL (CSS ONLY - NO IMAGE) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-slate-900 flex-col justify-between p-12">
        
        {/* 1. The Background Pattern - Geometric Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

        {/* 2. Abstract Gradient Blobs for "City Lights" effect */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px]" />

        {/* 3. Branding Content */}
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 mb-6">
             <Building2 className="text-white w-6 h-6" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
            SUDHAAR.
          </h1>
          <div className="h-1 w-20 bg-blue-500 mt-4 rounded-full"></div>
        </div>

        {/* 4. Quote */}
        <div className="relative z-10 max-w-md">
          <p className="text-2xl text-slate-200 font-medium leading-relaxed">
            "Transparency isn't just a buzzword; it's the foundation of a better community."
          </p>
          <div className="mt-6 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border border-slate-600">
               CM
             </div>
             <div className="text-sm text-slate-400">
                <span className="block text-white font-bold">City Management</span>
                Partner since 2024
             </div>
          </div>
        </div>

      </div>

      {/* RIGHT: Form Container */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative bg-white">
        
        <Link to="/" className="absolute top-8 left-8 md:left-24 text-slate-400 hover:text-blue-600 flex items-center gap-2 transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-10 mt-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-500 text-lg">{subtitle}</p>
        </div>

        {children}
        
      </div>
    </div>
  );
}