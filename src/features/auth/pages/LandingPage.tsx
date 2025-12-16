import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, Activity, Users,
  BarChart3, CheckCircle2, DollarSign, MapPin, 
  Heart, Menu, X 
} from "lucide-react";
// Separate type import to prevent babel parsing errors
import type { LucideIcon } from "lucide-react";

// --- CONFIGURATION ---
const HERO_IMAGE = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- OPTIMIZED SCROLL LISTENER ---
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const offset = window.scrollY > 50;
          setIsScrolled((prev) => (prev !== offset ? offset : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 font-sans overflow-x-hidden selection:bg-blue-200">
      
      {/* --- 1. SMART NAVBAR --- */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "bg-white/90 backdrop-blur-md shadow-sm py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-black tracking-tighter drop-shadow-md transition-colors ${isScrolled || mobileMenuOpen ? "text-slate-900" : "text-white"}`}>
              SUDHAAR.
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {["Impact", "Features", "About"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className={`text-sm font-bold hover:text-blue-400 transition-colors ${
                  isScrolled ? "text-slate-600" : "text-white/90 hover:text-white"
                }`}
              >
                {item}
              </a>
            ))}
            <div className="flex gap-4 ml-4">
              <Link to="/login" className={`px-5 py-2 font-bold transition-colors ${
                  isScrolled ? "text-slate-700 hover:text-blue-600" : "text-white hover:text-blue-200"
              }`}>
                Log In
              </Link>
              <Link 
                to="/register" 
                className={`px-6 py-2 font-bold rounded-full transition-all shadow-lg active:scale-95 ${
                    isScrolled 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-white text-blue-900 hover:bg-blue-50"
                }`}
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen 
              ? <X className="text-slate-900" /> 
              : <Menu className={isScrolled ? "text-slate-900" : "text-white"} />
            }
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 px-6 py-4 overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {["Impact", "Features", "About"].map((item) => (
                  <a 
                    key={item} 
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-slate-600 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="h-px bg-slate-100 my-2"></div>
                <Link to="/login" className="text-slate-900 font-bold py-2">Log In</Link>
                <Link to="/register" className="bg-blue-600 text-white font-bold py-3 rounded-xl text-center shadow-lg">
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

{/* --- 2. HERO SECTION --- */}
      {/* ADDED pt-32 to push content down away from the fixed navbar */}
      <div className="relative w-full h-[100dvh] min-h-[600px] flex flex-col justify-center overflow-hidden pt-20">
        
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="City Background" 
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/20"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8 flex flex-col items-start"
            >
              
              {/* Badge - Now clearly separated from top */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm w-fit whitespace-nowrap">
                <div className="p-1 bg-blue-500 rounded-full flex items-center justify-center">
                  <Users className="text-white h-3 w-3" />
                </div>
                <span className="text-blue-200 text-xs font-bold tracking-widest uppercase">
                  Citizen Powered Platform
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                Your Voice. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Your City.
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 max-w-lg leading-relaxed font-medium">
                Join thousands of citizens making the city cleaner and safer. Report issues, track resolutions, and see real-time impact.
              </p>
              
              {/* Primary Action Button */}
              <div className="pt-4">
                <Link to="/register" className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:-translate-y-1">
                  Get Started
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="pt-8 flex items-center gap-8 border-t border-white/10 text-slate-400 w-full">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="text-emerald-400 h-5 w-5" />
                    <span className="text-sm font-semibold">Verified by Authorities</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Activity className="text-blue-400 h-5 w-5" />
                    <span className="text-sm font-semibold">Live Tracking</span>
                 </div>
              </div>
            </motion.div>
            
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>

      {/* --- 3. STATS SECTION --- */}
      <section id="impact" className="bg-white py-12 border-b border-slate-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           <StatItem number="1,234" label="Issues Reported" icon={BarChart3} color="text-blue-600" />
           <StatItem number="987" label="Issues Resolved" icon={CheckCircle2} color="text-emerald-600" />
           <StatItem number="450+" label="Active Citizens" icon={Users} color="text-amber-500" />
           <StatItem number="PKR 6.5M" label="Funds Raised" icon={DollarSign} color="text-purple-600" />
        </div>
      </section>

      {/* --- 4. FEATURES SECTION --- */}
      <section className="pt-24 pb-24 px-6 max-w-7xl mx-auto" id="features">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">Core Features</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Empowering Citizens,<br/>Enabling Authorities.</h3>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Sudhaar bridges the gap between the public and the government with a suite of transparency and management tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <FeatureCard 
             icon={MapPin}
             title="Geolocated Reporting"
             desc="Pinpoint issues on an interactive map. Authorities see exactly where the problem is, reducing response time."
           />
           <FeatureCard 
             icon={CheckCircle2}
             title="Transparent Tracking"
             desc="Watch your report go from 'Pending' to 'Resolved'. Receive notifications at every step of the lifecycle."
           />
           <FeatureCard 
             icon={Heart}
             title="Community Funding"
             desc="Donate directly to specific projects. See exactly how funds are utilized with our audit dashboard."
           />
        </div>
      </section>

      {/* --- 5. ABOUT SECTION --- */}
      <section id="about" className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
           {/* Left: The Story */}
           <div className="flex flex-col items-start">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 mb-6">
               <span className="text-blue-700 text-xs font-bold tracking-wide uppercase">Our Mission</span>
             </div>
             
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
               Building a Better <br/>
               <span className="text-blue-600">Future, Together.</span>
             </h2>
             
             <p className="text-lg text-slate-600 mb-6 leading-relaxed">
               Sudhaar isn't just an app; it's a movement. We recognized that the biggest hurdle to civic improvement wasn't a lack of resources, but a lack of communication.
             </p>
             
             <p className="text-lg text-slate-600 mb-8 leading-relaxed">
               By connecting citizens directly with the <strong>Municipal Corporation</strong> and local NGOs, we turn complaints into data, and data into action. Every report you file creates a transparent digital trail that cannot be ignored.
             </p>
           </div>

           {/* Right: The Visual */}
           <div className="relative">
             <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
               <img 
                 src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1600&auto=format&fit=crop" 
                 alt="Community volunteering" 
                 className="w-full h-full object-cover"
               />
             </div>
             {/* Floating Quote Card */}
             <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border border-slate-50 max-w-xs hidden md:block">
               <p className="text-slate-600 italic font-medium mb-4">"This platform has completely changed how we handle street maintenance. The transparency is a game changer."</p>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">AD</div>
                 <div>
                   <div className="text-xs font-bold text-slate-900">Ahmed D.</div>
                   <div className="text-[10px] text-slate-400 font-bold uppercase">Municipal Officer</div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Trusted Partners Strip */}
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-slate-200">
           <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Trusted by Local Authorities & Partners</p>
           <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-black text-xl text-slate-800">
                 <ShieldCheck className="h-8 w-8 text-slate-800" />
                 <span>Municipal Dept.</span>
              </div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-800">
                 <Heart className="h-8 w-8 text-slate-800" />
                 <span>Green NGO</span>
              </div>
              <div className="flex items-center gap-2 font-black text-xl text-slate-800">
                 <CheckCircle2 className="h-8 w-8 text-slate-800" />
                 <span>City Traffic</span>
              </div>
           </div>
        </div>
      </section>

      {/* --- 6. CTA SECTION --- */}
      <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to make a difference?</h2>
          <p className="text-slate-300 text-xl mb-10">
            Join the platform where voices become change. It takes less than 2 minutes to create an account and file your first report.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Navigate to Register Page */}
            <Link to="/register" className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all text-lg">
              Get Started Now
            </Link>
            
            {/* FIX: Scroll to About Section (Changed Link to <a>) */}
            <a 
              href="#about" 
              className="px-10 py-4 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-60 text-sm">
          <p>© 2025 Sudhaar Civic Management. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {/* Updated to use actual Routes */}
            <Link to="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
// --- SUB-COMPONENTS ---

interface StatItemProps {
  number: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ number, label, icon: Icon, color }) => (
  <div className="text-center group cursor-default">
    <div className={`mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-3xl font-black text-slate-900 mb-1">{number}</div>
    <div className="text-slate-500 font-medium text-sm uppercase tracking-wider">{label}</div>
  </div>
);

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className="w-14 h-14 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
      <Icon className="w-7 h-7" />
    </div>
    <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);