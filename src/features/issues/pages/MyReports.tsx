import { useState, useMemo } from "react";
import { 
  Clock, CheckCircle2, AlertTriangle, MapPin, 
  Search, Plus, FileText, Activity, 
  ArrowRight, Calendar, Sparkles, Filter
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORTS ---
import { ImageWithFallback } from "../../../components/ui/ImageWithFallback";
import { IssueStatus, Issue } from "../type";
import IssueDetailModal from "../components/IssueDetailModal";
import ReportModal from "../components/ReportModal"; // <--- Importing the Modal

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const MY_REPORTS = [
  {
    id: 101,
    title: "Deep Pothole on Main Road",
    location: "Zafarwal Road, Narowal",
    date: "2 days ago",
    status: "In Progress" as IssueStatus,
    category: "Roads",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    description: "Multiple bikers have slipped here. It is right on the turn. Needs immediate filling.",
    updates: [
      { status: "Reported", date: "Oct 24", done: true },
      { status: "Verified", date: "Oct 25", done: true },
      { status: "In Progress", date: "Oct 26", done: true },
      { status: "Resolved", date: "Pending", done: false },
    ],
    officialNote: "Maintenance crew dispatched. Completion expected in 24 hours."
  },
  {
    id: 102,
    title: "Street Light Malfunction",
    location: "Sector 4, Block B",
    date: "1 week ago",
    status: "Resolved" as IssueStatus,
    category: "Electricity",
    image: "https://images.unsplash.com/photo-1562519782-b7ca57020d2d?auto=format&fit=crop&q=80&w=800",
    description: "The street light has been flickering for weeks and is now completely off.",
    updates: [
      { status: "Reported", date: "Oct 18", done: true },
      { status: "Verified", date: "Oct 19", done: true },
      { status: "In Progress", date: "Oct 20", done: true },
      { status: "Resolved", date: "Oct 22", done: true },
    ],
    officialNote: "Bulb replaced with LED unit. Validated by night patrol."
  },
  {
    id: 103,
    title: "Garbage Pileup Near School",
    location: "Govt High School No.1",
    date: "Just now",
    status: "Pending" as IssueStatus,
    category: "Sanitation",
    image: "https://images.unsplash.com/photo-1530587191026-aa1e5327602f?auto=format&fit=crop&q=80&w=800",
    description: "Huge pile of garbage accumulating near the school entrance.",
    updates: [
      { status: "Reported", date: "Today", done: true },
      { status: "Verified", date: "Pending", done: false },
      { status: "In Progress", date: "Pending", done: false },
      { status: "Resolved", date: "Pending", done: false },
    ],
    officialNote: null
  },
  {
    id: 104,
    title: "Broken Water Pipe",
    location: "Circular Road",
    date: "3 days ago",
    status: "Verified" as IssueStatus,
    category: "Water",
    image: "https://images.unsplash.com/photo-1584905066893-7d5c142dd95d?auto=format&fit=crop&q=80&w=800",
    description: "Clean water is being wasted due to a leak in the main supply line.",
    updates: [
      { status: "Reported", date: "Oct 23", done: true },
      { status: "Verified", date: "Oct 24", done: true },
      { status: "In Progress", date: "Pending", done: false },
      { status: "Resolved", date: "Pending", done: false },
    ],
    officialNote: "Verified. Request sent to WASA."
  },
  {
    id: 105,
    title: "School Wall Collapse",
    location: "Model Town",
    date: "2 weeks ago",
    status: "Resolved" as IssueStatus,
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    description: "Boundary wall collapsed due to recent rains.",
    updates: [
      { status: "Reported", date: "Oct 01", done: true },
      { status: "Verified", date: "Oct 02", done: true },
      { status: "In Progress", date: "Oct 05", done: true },
      { status: "Resolved", date: "Oct 15", done: true },
    ],
    officialNote: "Wall reconstructed."
  }
];

// --- UI COMPONENTS ---

const StatsCard = ({ label, value, icon: Icon, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm hover:shadow-lg transition-all group"
  >
    <div className={cn("absolute top-0 right-0 p-24 rounded-full opacity-5 blur-3xl transition-all group-hover:opacity-10", color.replace('text-', 'bg-'))} />
    <div className="flex items-center gap-5 relative z-10">
      <div className={cn("p-4 rounded-2xl shadow-inner", color.replace('text-', 'bg-').replace('600', '50'), color)}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: IssueStatus }) => {
  const styles: Record<string, string> = {
  "Pending": "bg-amber-100/80 text-amber-700 border-amber-200",
  "Verified": "bg-blue-100/80 text-blue-700 border-blue-200",
  "In Progress": "bg-purple-100/80 text-purple-700 border-purple-200",
  "Resolved": "bg-emerald-100/80 text-emerald-700 border-emerald-200",
  "Critical": "bg-red-100/80 text-red-700 border-red-200",
};
  const Icon = status === "In Progress" ? Activity : (status === "Resolved" || status === "Verified" ? CheckCircle2 : (status === "Critical" ? AlertTriangle : Clock));
  
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-sm", styles[status])}>
      <Icon size={12} className={status === "In Progress" ? "animate-pulse" : ""} />
      {status}
    </span>
  );
};

const Timeline = ({ updates }: { updates: any[] }) => (
  <div className="relative mt-8 px-1">
    <div className="absolute top-2.5 left-0 w-full h-1 bg-slate-100 rounded-full -z-10">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${(updates.filter(u => u.done).length - 1) / (updates.length - 1) * 100}%` }}
         transition={{ duration: 1, delay: 0.2 }}
         className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" 
       />
    </div>
    <div className="flex justify-between">
      {updates.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 * idx }}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center border-[3px] transition-all z-10",
              step.done 
                ? "bg-white border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]" 
                : "bg-slate-50 border-slate-200"
            )}
          >
            {step.done && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
          </motion.div>
          <div className="text-center mt-3">
            <p className={cn("text-[10px] font-bold uppercase tracking-wide", step.done ? "text-slate-800" : "text-slate-400")}>
              {step.status}
            </p>
            {step.date !== "Pending" && (
               <p className="text-[10px] text-slate-400 font-medium mt-0.5">{step.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function MyReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"Active" | "History">("Active");
  const [selectedReport, setSelectedReport] = useState<Issue | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); // Controls the modal

  const filteredReports = useMemo(() => {
    return MY_REPORTS.filter(r => {
      const matchesTab = activeTab === "Active" ? r.status !== "Resolved" : r.status === "Resolved";
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm]);

  const totalReports = MY_REPORTS.length;
  const resolvedCount = MY_REPORTS.filter(r => r.status === "Resolved").length;
  const activeCount = totalReports - resolvedCount;

  // Mapper
 // Mapper
  const openReportModal = (report: typeof MY_REPORTS[0]) => {
    setSelectedReport({
      id: report.id,
      title: report.title,
      description: report.description, // <--- CHANGED 'desc' TO 'description'
      location: report.location,
      status: report.status,
      category: report.category as any,
      image: report.image,
      author: "You",
      avatar: "ME",
      timeText: report.date,
      timestamp: Date.now(),
      distance: 0,
      votes: 0,
      initialComments: report.officialNote ? [{
        id: "off-1", user: "Official", avatar: "🏛️", role: "Official", text: report.officialNote, time: "Latest Update"
      }] : []
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 pt-8 relative overflow-hidden">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* --- INCREASED WIDTH TO 7XL --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border border-blue-200">Citizen Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Reports</h1>
            <p className="text-slate-500 mt-2 text-lg">Track real-time updates on your civic contributions.</p>
          </div>
          
          {/* NEW REPORT BUTTON OPENS MODAL */}
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:-translate-y-1 active:translate-y-0 active:scale-95"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
            New Report
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <StatsCard label="Total Submitted" value={totalReports} icon={FileText} color="text-blue-600" delay={0} />
          <StatsCard label="Pending Action" value={activeCount} icon={Activity} color="text-amber-600" delay={0.1} />
          <StatsCard label="Successfully Resolved" value={resolvedCount} icon={CheckCircle2} color="text-emerald-600" delay={0.2} />
        </div>

        {/* CONTENT CARD */}
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-xl overflow-hidden">
          
          {/* Controls */}
          <div className="p-2 border-b border-slate-200/60 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/40">
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl w-full sm:w-auto border border-slate-200/50">
              {["Active", "History"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "relative flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all z-10",
                    activeTab === tab ? "text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {activeTab === tab && (
                    <motion.div layoutId="tab-bg" className="absolute inset-0 bg-white rounded-xl shadow-sm -z-10" />
                  )}
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="relative w-full sm:w-80 group">
              <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 z-10" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="relative w-full pl-11 pr-4 py-3 bg-white/50 border border-slate-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* LIST AREA */}
          <div className="p-6 md:p-8 space-y-6 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={report.id} 
                    onClick={() => openReportModal(report)}
                    className="group relative bg-white/60 hover:bg-white rounded-3xl p-6 md:p-8 border border-slate-100 hover:border-blue-200/50 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="absolute top-6 right-6 z-10"><StatusBadge status={report.status} /></div>
                    
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-36 h-36 shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
                        <ImageWithFallback src={report.image} alt={report.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">{report.category}</span>
                           <span className="text-slate-300 text-[10px]">•</span>
                           <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Calendar size={10} /> {report.date}</span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{report.title}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mb-8">
                          <MapPin size={14} className="text-blue-400" /> {report.location}
                        </p>

                        <Timeline updates={report.updates} />
                        
                        {report.officialNote && (
                          <div className="mt-8 relative pl-6">
                             <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-200 rounded-full" />
                             <div className="flex items-start gap-3">
                                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg mt-0.5"><Sparkles size={12} /></div>
                                <div>
                                   <p className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">Official Update</p>
                                   <p className="text-sm text-slate-600 font-medium leading-relaxed">"{report.officialNote}"</p>
                                </div>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="absolute bottom-8 right-8 flex items-center gap-2 text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                       View Full Details <div className="bg-blue-100 p-1.5 rounded-full"><ArrowRight size={14} /></div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                    <Filter size={40} className="text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No reports found</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mb-8 font-medium">
                    {searchTerm ? "No results match your search." : activeTab === "Active" ? "You're all caught up! No active issues." : "No resolved history yet."}
                  </p>
                  {activeTab === "Active" && !searchTerm && (
                    <button 
                      onClick={() => setIsReportModalOpen(true)}
                      className="text-blue-600 font-bold hover:bg-blue-50 px-6 py-2 rounded-xl transition-colors"
                    >
                       Submit a new report
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* MODALS */}
      <IssueDetailModal issue={selectedReport} onClose={() => setSelectedReport(null)} />
      <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
    </div>
  );
}