import { useState, useMemo } from 'react';
import { 
  Search, Building2, ArrowRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback';
import CampaignModal from "./CampaignModal"; // We will create this next

// --- MOCK DATA: CAMPAIGNS ---
export const CAMPAIGNS = [
  {
    id: "CAMP-001",
    title: "Rehabilitate Gulberg Main Park",
    ngo: "Green Lahore Trust",
    category: "Environment",
    verified: true,
    image: "https://images.unsplash.com/photo-1596230529625-7ee54136652b?auto=format&fit=crop&q=80&w=800",
    raised: 325000,
    goal: 500000,
    donors: 142,
    desc: "Restoring the walking tracks and installing solar lights for community safety.",
    budget: [
        { item: "Solar Lights (x10)", cost: 200000, funded: 150000 },
        { item: "Track Repair", cost: 150000, funded: 100000 },
        { item: "Labor", cost: 100000, funded: 50000 },
        { item: "Plants", cost: 50000, funded: 25000 },
    ]
  },
  {
    id: "CAMP-002",
    title: "Clean Water for Model Town",
    ngo: "Al-Khidmat Foundation",
    category: "Health",
    verified: true,
    image: "https://images.unsplash.com/photo-1538300342682-cf57afb97285?auto=format&fit=crop&q=80&w=800",
    raised: 150000,
    goal: 800000,
    donors: 45,
    desc: "Installing a new filtration plant to provide clean drinking water to 500+ households.",
    budget: [
        { item: "Filtration Unit", cost: 500000, funded: 100000 },
        { item: "Boring & Piping", cost: 200000, funded: 50000 },
        { item: "Maintenance Fund", cost: 100000, funded: 0 },
    ]
  },
  {
    id: "CAMP-003",
    title: "Books for Street Children",
    ngo: "The Citizens Foundation",
    category: "Education",
    verified: true,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
    raised: 50000,
    goal: 100000,
    donors: 89,
    desc: "Providing textbooks and stationery to 200 underprivileged children in Katchi Abadis.",
    budget: [
        { item: "Textbooks (x200)", cost: 60000, funded: 40000 },
        { item: "Stationery Kits", cost: 30000, funded: 10000 },
        { item: "School Bags", cost: 10000, funded: 0 },
    ]
  },
  {
    id: "CAMP-004",
    title: "Fix Street Lights Sector G",
    ngo: "Sudhaar Community",
    category: "Civic",
    verified: true,
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&q=80&w=800",
    raised: 25000,
    goal: 150000,
    donors: 12,
    desc: "Replacing broken street lights to improve night-time security in Sector G.",
    budget: [
        { item: "LED Lights (x15)", cost: 100000, funded: 20000 },
        { item: "Wiring & Labor", cost: 50000, funded: 5000 },
    ]
  }
];

export default function NGOPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<typeof CAMPAIGNS[0] | null>(null);

  const categories = ["All", "Health", "Education", "Environment", "Civic"];

  const filteredCampaigns = useMemo(() => {
    return CAMPAIGNS.filter(c => {
      const matchesCat = selectedCategory === "All" || c.category === selectedCategory;
      const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.ngo.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="bg-slate-900 pt-16 pb-24 px-6 text-center rounded-b-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6">
             <Building2 size={14} /> Partnered NGOs
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Fund Real Change. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Directly & Transparently.
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Browse verified campaigns from trusted NGOs and Municipal partners. 
            See exactly how your budget is utilized.
          </p>
        </div>
      </div>

      {/* --- FILTERS & CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        
        {/* Search Bar */}
        <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 mb-8 border border-slate-100">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search causes or NGOs..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar p-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
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
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={camp.id}
                  onClick={() => setSelectedCampaign(camp)}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative">
                    <ImageWithFallback src={camp.image} alt={camp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                      {camp.verified && <Building2 size={12} className="text-blue-500" />} {camp.ngo}
                    </div>
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {camp.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
                      {camp.title}
                    </h3>
                    <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                      {camp.desc}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                        <span>{percent}% Funded</span>
                        <span>PKR {camp.goal.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(percent, 100)}%` }}></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {String.fromCharCode(64 + i)}
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white border-2 border-white flex items-center justify-center text-[10px] font-bold">
                          +{camp.donors}
                        </div>
                      </div>
                      <button className="flex items-center gap-2 text-emerald-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                        Donate Now <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No campaigns found matching your criteria.</p>
            <button onClick={() => {setSearchQuery(""); setSelectedCategory("All")}} className="text-emerald-600 font-bold mt-2 hover:underline">Clear Filters</button>
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