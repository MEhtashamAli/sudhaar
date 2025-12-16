import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Search, Filter, Calendar, 
  CheckCircle, MapPin, Tag
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- IMPORTS ---
// Adjust these paths if your file structure is different
import { ImageWithFallback } from "../../../components/ui/ImageWithFallback";
import TransparencyDetailModal from "../components/TransparencyDetailModal";
import { ISSUES_DATA } from "../../issues/data/mockIssues"; // Shared Data Source
import { Issue } from "../../issues/type";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SUB-COMPONENT: ARCHIVE CARD ---
const ArchiveCard = ({ issue, onClick }: { issue: Issue; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
  >
    <div className="h-48 overflow-hidden relative">
      {/* Image with Grayscale effect that vanishes on hover */}
      <ImageWithFallback 
        src={issue.image || ""} 
        alt={issue.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0" 
      />
      
      {/* Status Badge */}
      <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-200 shadow-sm flex items-center gap-1">
        <CheckCircle size={10} /> VERIFIED RESOLVED
      </div>
    </div>
    
    <div className="p-5">
      {/* Meta Tags */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
           <Tag size={10} /> {issue.category}
        </span>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
           <Calendar size={10} /> {issue.timeText}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 leading-tight mb-2 group-hover:text-emerald-700 transition-colors">
        {issue.title}
      </h3>
      
      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
        {issue.description}
      </p>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin size={12} /> {issue.location}
        </span>
        <span className="font-medium text-slate-600">
          By: {issue.author}
        </span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function ResolvedArchivePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // 1. DATA: Filter only Resolved issues from the main dataset
  const archiveData = useMemo(() => {
    return ISSUES_DATA.filter(issue => issue.status === "Resolved");
  }, []);

  // 2. CATEGORIES: Automatically find all unique categories in the resolved data
  const categories = useMemo(() => {
    const uniqueCats = Array.from(new Set(archiveData.map(i => i.category)));
    return ["All", ...uniqueCats];
  }, [archiveData]);

  // 3. FILTERING: Apply Search & Category logic
  const filteredData = useMemo(() => {
    return archiveData.filter(issue => {
      const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (issue.location || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, archiveData]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <button 
              onClick={() => navigate('/transparency')}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-700 font-bold text-sm mb-3 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Transparency
            </button>
            <h1 className="text-3xl font-black text-slate-900">Resolved Archive</h1>
            <p className="text-slate-500 mt-1">
              A permanent public record of {archiveData.length} successfully resolved civic issues.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search by title or location..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 md:pb-0 no-scrollbar">
            <Filter size={16} className="text-slate-400 mr-2 shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border capitalize",
                  selectedCategory === cat 
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT GRID */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map(issue => (
              <ArchiveCard 
                key={issue.id} 
                issue={issue} 
                onClick={() => setSelectedIssue(issue)}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No records found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
            <button 
               onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
               className="mt-4 text-emerald-600 font-bold text-sm hover:underline"
            >
               Clear Filters
            </button>
          </div>
        )}

      </div>

      {/* DETAIL MODAL (Read-Only) */}
      <TransparencyDetailModal issue={selectedIssue as any} onClose={() => setSelectedIssue(null)} />
    </div>
  );
}