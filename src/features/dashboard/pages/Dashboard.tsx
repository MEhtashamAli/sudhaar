import { useState, useEffect, useMemo } from "react";
import { Camera, Loader2, ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- IMPORTS ---
// Adjust paths if necessary based on your file structure
import ReportModal from "../../issues/components/ReportModal";
import { IssueCard } from "../../issues/components/IssueCard";
import IssueDetailModal from "../../issues/components/IssueDetailModal";
import { ISSUES_DATA } from "../../issues/data/mockIssues";
import { Issue } from "../../issues/type";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("Trending");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  
  // 1. STATE FOR THE POST DETAILS MODAL
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  // 2. STATE FOR THE REPORT ISSUE MODAL
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sortedIssues = useMemo(() => {
    const data = [...ISSUES_DATA]; 
    switch (activeFilter) {
  case "Newest": return data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  default: return data.sort((a, b) => (b.votes || 0) - (a.votes || 0));
}
  }, [activeFilter]);

  const visibleIssues = sortedIssues.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-20">
      
      {/* HERO SECTION */}
      <div className="bg-slate-900 pt-16 pb-24 px-6 text-center lg:text-left relative overflow-hidden rounded-b-[3rem] shadow-2xl shadow-slate-900/20 mb-[-3rem] z-0 mx-0 sm:mx-4 mt-0 sm:mt-4">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/4" />
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
           <div className="max-w-2xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 text-[10px] font-bold text-blue-200 mb-6 backdrop-blur-sm shadow-inner">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               LIVE: NAROWAL DISTRICT
             </div>
             <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
               Sudhaar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Narowal</span>
             </h1>
             <p className="text-slate-400 text-lg font-medium leading-relaxed">
               Make your voice heard. Report civic issues, track real-time progress, and collaborate directly with local officials.
             </p>
           </div>
           
           <button 
             onClick={() => setIsReportModalOpen(true)}
             className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-900/20 hover:scale-105 active:scale-95 w-full lg:w-auto"
           >
              <Camera className="h-5 w-5 text-blue-700" /> <span className="text-lg">Report Issue</span>
           </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* FILTER BAR */}
        <div className="sticky top-4 z-30 mb-8 bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/60 shadow-lg shadow-slate-200/20 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar p-1">
             {["Trending", "Newest", "Near Me"].map(filter => (
               <button
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={cn(
                   "whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
                   activeFilter === filter ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                 )}
               >
                 {filter}
               </button>
             ))}
           </div>
        </div>

        {/* ISSUE GRID */}
        {isLoading ? (
           <div className="min-h-[400px] flex flex-col items-center justify-center text-slate-400">
             <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-600" />
             <p className="font-medium animate-pulse">Syncing with Grid...</p>
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {visibleIssues.map((issue, index) => (
               <IssueCard 
                 key={issue.id} 
                 issue={issue} 
                 // 3. PASS THE CLICK HANDLER HERE
                 onClick={() => setSelectedIssue(issue)}
                 priority={index < 4} 
               />
             ))}
           </div>
        )}

        {/* LOAD MORE */}
        {visibleIssues.length < sortedIssues.length && !isLoading && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setVisibleCount(p => p + 6)}
              className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
            >
              Load More Issues <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}

      </main>

      {/* --- MODALS --- */}
      
      {/* 4. RENDER THE DETAIL MODAL */}
      <IssueDetailModal 
        issue={selectedIssue} 
        onClose={() => setSelectedIssue(null)} 
      />
      
      {/* 5. RENDER THE REPORT MODAL */}
      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
      /> 
    </div>
  );
}