import { useState, useMemo } from 'react';
import { 
  Search, Building2, 
  Flame, CheckCircle2, Leaf, Heart, Handshake 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback';
import CampaignModal from './CampaignModal'; 

// --- UPDATED MOCK DATA: REALISTIC COMMUNITY PROJECTS ---
export const CAMPAIGNS = [
  {
    id: "CAMP-001",
    title: "Urban Forest & Green Belts",
    ngo: "Green Lahore Trust",
    category: "Environment",
    verified: true,
    zakatEligible: false,
    image: "https://images.unsplash.com/photo-1596230529625-7ee54136652b?auto=format&fit=crop&q=80&w=800",
    raised: 325000,
    goal: 500000,
    donors: 142,
    daysLeft: 5,
    desc: "Planting 500 trees and creating green belts in Sector D to combat smog and urban heat.",
    budget: [
        { item: "Saplings (x500)", cost: 150000, funded: 150000 },
        { item: "Soil Preparation", cost: 150000, funded: 100000 },
        { item: "Gardener Wages", cost: 100000, funded: 50000 },
        { item: "Fencing", cost: 100000, funded: 25000 },
    ]
  },
  {
    id: "CAMP-002",
    title: "Free Water Filtration Plant",
    ngo: "Al-Khidmat Foundation",
    category: "Health",
    verified: true,
    zakatEligible: true,
    image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800",
    raised: 150000,
    goal: 800000,
    donors: 45,
    daysLeft: 20,
    desc: "Providing clean, filtered drinking water to low-income households in Model Town Extension.",
    budget: [
        { item: "RO Plant Unit", cost: 500000, funded: 100000 },
        { item: "Boring & Installation", cost: 200000, funded: 50000 },
        { item: "Maintenance Fund", cost: 100000, funded: 0 },
    ]
  },
  {
    id: "CAMP-003",
    title: "Digital Lab for Govt School",
    ngo: "The Citizens Foundation",
    category: "Education",
    verified: true,
    zakatEligible: true,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    raised: 92000,
    goal: 300000,
    donors: 89,
    daysLeft: 2,
    desc: "Equipping the local high school with 10 computers to teach coding skills to underprivileged students.",
    budget: [
        { item: "Computers (x10)", cost: 200000, funded: 60000 },
        { item: "Networking", cost: 50000, funded: 30000 },
        { item: "Furniture", cost: 50000, funded: 2000 },
    ]
  },
  {
    id: "CAMP-004",
    title: "Solar Security Lights",
    ngo: "Sudhaar Community",
    category: "Civic",
    verified: true,
    zakatEligible: false,
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&q=80&w=800",
    raised: 25000,
    goal: 150000,
    donors: 12,
    daysLeft: 15,
    desc: "Upgrading street lights to Smart Solar LEDs for sustainable, off-grid night security.",
    budget: [
        { item: "Solar Panels", cost: 100000, funded: 20000 },
        { item: "Installation", cost: 50000, funded: 5000 },
    ]
  }
];

export default function NGOPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [zakatOnly, setZakatOnly] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof CAMPAIGNS[0] | null>(null);

  const categories = ["All", "Health", "Education", "Environment", "Civic"];

  const filteredCampaigns = useMemo(() => {
    return CAMPAIGNS.filter(c => {
      const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.ngo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZakat = zakatOnly ? c.zakatEligible : true;
      return matchesCat && matchesSearch && matchesZakat;
    });
  }, [selectedCategory, searchQuery, zakatOnly]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 pt-16 pb-24 px-6 text-center rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
             <Handshake size={14} /> Public-Private Partnership
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Elevate Our City.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Support Community Projects.
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Go beyond basic services. Collaborate with verified NGOs to fund libraries, green belts, and clean water projects.
          </p>
        </div>
      </div>

      {/* --- FILTERS & CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* Controls Bar */}
        <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-4 mb-8 border border-slate-100">
          
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Zakat Toggle */}
          <button 
            onClick={() => setZakatOnly(!zakatOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
              zakatOnly 
              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${zakatOnly ? "bg-emerald-500 border-emerald-500" : "border-slate-300"}`}>
              {zakatOnly && <CheckCircle2 size={12} className="text-white" />}
            </div>
            Zakat Eligible
          </button>

          {/* Categories */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                  ? "bg-slate-900 text-white shadow-lg" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCampaigns.map((camp) => {
              const percent = Math.round((camp.raised / camp.goal) * 100);
              const isUrgent = percent > 80 || camp.daysLeft < 3;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={camp.id}
                  onClick={() => setSelectedCampaign(camp)}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full"
                >
                  <div className="h-52 overflow-hidden relative">
                    <ImageWithFallback src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Zakat Badge */}
                    {camp.zakatEligible && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-emerald-700 shadow-sm flex items-center gap-1 border border-emerald-100">
                            <Leaf size={10} /> ZAKAT
                        </div>
                    )}

                    {/* Urgency Badge */}
                    {isUrgent && (
                        <div className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 animate-pulse">
                            <Flame size={10} /> ENDING SOON
                        </div>
                    )}

                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                      {camp.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
                      {camp.title}
                    </h3>
                    <p className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-1">
                        <Building2 size={12} /> {camp.ngo}
                    </p>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                      {camp.desc}
                    </p>

                    {/* Funding Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>{percent}% Funded</span>
                        <span>{camp.daysLeft} days left</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${percent >= 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
                        <span>PKR {camp.raised.toLocaleString()}</span>
                        <span>Goal: {camp.goal.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 mt-auto">
                      <button className="w-full py-3 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white">
                        Support Project <Heart size={16} className="group-hover:fill-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No campaigns found matching your criteria.</p>
            <button onClick={() => {setSearchQuery(""); setSelectedCategory("All"); setZakatOnly(false)}} className="text-emerald-600 font-bold mt-2 hover:underline">Clear Filters</button>
          </div>
        )}

      </div>

      {/* --- CAMPAIGN MODAL --- */}
      <CampaignModal 
        isOpen={!!selectedCampaign} 
        onClose={() => setSelectedCampaign(null)} 
        campaign={selectedCampaign} 
      />

    </div>
  );
}