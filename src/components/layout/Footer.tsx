import { Link } from "react-router-dom";
import { 
  Mail, Phone, MapPin, Twitter, Facebook, Instagram, 
  ArrowRight, Heart, ShieldCheck 
} from "lucide-react";
import logoImg from "../../assets/sudhaar_logo.png"; 

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // NOTE: Links that point to pages we haven't created yet (like /about) 
  // will show a blank screen until we create those files.
  const links = {
    quick: [
      { name: "Report Issue", path: "/dashboard" },
      { name: "Transparency", path: "/transparency" },
      { name: "Partner NGOs", path: "/donate" },
      { name: "My Reports", path: "/reports" },
    ],
    company: [
      { name: "About Sudhaar", path: "/about" }, // Placeholder
      { name: "Our Mission", path: "/mission" }, // Placeholder
      { name: "Success Stories", path: "/stories" }, // Placeholder
      { name: "Contact Support", path: "/contact" }, // Placeholder
    ],
    legal: [
      { name: "Privacy Policy", path: "/legal/privacy" }, // Placeholder
      { name: "Terms of Service", path: "/legal/terms" }, // Placeholder
      { name: "Cookie Policy", path: "/legal/cookies" }, // Placeholder
    ]
  };

  // UPDATED: Added real URLs so the buttons work
  const socialIcons = [
    { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="relative w-full bg-slate-950 text-white mt-auto overflow-hidden">
      
      {/* 1. Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />

      {/* 2. Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16 pb-8">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* BRAND COLUMN (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={logoImg} 
                  alt="Sudhaar Logo" 
                  className="h-10 w-auto object-contain brightness-200 invert relative z-10" 
                  onError={(e) => e.currentTarget.style.display = 'none'} 
                />
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">
                SUDHAAR
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              Empowering citizens to fix their cities. We bridge the gap between people and progress through transparent, location-based civic engagement.
            </p>
            
            {/* UPDATED: Socials now open in new tab */}
            <div className="flex gap-4 pt-2">
              {socialIcons.map((social, index) => (
                <a 
                  key={index} 
                  href={social.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-700 hover:scale-110 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon size={18} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS COLUMNS (Span 2 each) */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-white text-lg tracking-wide">Platform</h3>
            <ul className="space-y-3">
              {links.quick.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-bold text-white text-lg tracking-wide">Company</h3>
            <ul className="space-y-3">
              {links.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-blue-400 text-sm font-medium transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors" />
                    <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* NEWSLETTER / CONTACT (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="font-bold text-white text-lg tracking-wide">Stay Connected</h3>
            <p className="text-slate-400 text-sm">
              Get the latest updates on resolved issues and new municipal projects in Narowal.
            </p>
            
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm placeholder:text-slate-600"
              />
              <button type="button" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25">
                <ArrowRight size={20} />
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Mail size={16} className="text-blue-500" /> support@sudhaar.pk
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <MapPin size={16} className="text-emerald-500" /> Narowal District, Punjab
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-8 mt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-sm flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span>&copy; {currentYear} Sudhaar Inc.</span>
            <div className="hidden md:block w-1 h-1 bg-slate-800 rounded-full" />
            <div className="flex gap-6">
              {links.legal.map(l => (
                <Link key={l.name} to={l.path} className="hover:text-white transition-colors">{l.name}</Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800">
            <span className="flex items-center gap-1.5">
              Made with <Heart size={12} className="fill-red-500 text-red-500 animate-pulse" /> in Pakistan
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck size={14} /> Secure
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}