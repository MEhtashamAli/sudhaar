import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  ShieldCheck, AlertCircle, CheckCircle, Activity, 
  TrendingUp, Wallet, HandCoins, Wrench, 
  Search, Calendar, Check, ArrowRight,
  LucideIcon, Building2, Landmark
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- IMPORTS ---
import { ImageWithFallback } from "../../../components/ui/ImageWithFallback";
import TransparencyDetailModal from "../components/TransparencyDetailModal";
import { ISSUES_DATA } from "../../issues/data/mockIssues"; // <--- NOW USING SHARED DATA
import { Issue } from "../../issues/type";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- TYPES ---
interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  color: "blue" | "emerald" | "amber" | "slate";
  delay?: number;
}

interface ResolvedCardProps {
  issue: Issue;
  onDetails: () => void;
}

interface TimelineEventProps {
  title: string;
  resolver: string;
  date: string;
  align: "left" | "right";
  icon: LucideIcon;
}

// --- SUB-COMPONENTS ---

// 1. STAT CARD
const StatCard = ({ icon: Icon, title, value, color, delay = 0 }: StatCardProps) => (
  <div 
    className={cn(
      "bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-[6px] animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards",
      color === "blue" ? "border-blue-600" : 
      color === "emerald" ? "border-emerald-500" : 
      color === "amber" ? "border-amber-500" : "border-slate-500"
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={cn("p-2 rounded-lg bg-slate-50", 
        color === "blue" ? "text-blue-600" : 
        color === "emerald" ? "text-emerald-600" : 
        color === "amber" ? "text-amber-600" : "text-slate-600"
      )}>
        <Icon size={24} />
      </div>
      <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
    </div>
    <p className={cn("text-4xl font-black", 
       color === "blue" ? "text-blue-700" : 
       color === "emerald" ? "text-emerald-700" : 
       color === "amber" ? "text-amber-700" : "text-slate-700"
    )}>{value}</p>
  </div>
);

// 2. RESOLVED PROJECT CARD (Connected to Real Data)
const ResolvedCard = ({ issue, onDetails }: ResolvedCardProps) => (
  <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
    <div className="h-48 overflow-hidden relative bg-slate-100">
      <ImageWithFallback 
        src={issue.image || ""} 
        alt={issue.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
        <CheckCircle size={12} /> Resolved
      </div>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{issue.title}</h4>
      <p className="text-sm text-slate-500 mb-1"><span className="font-semibold text-slate-700">Category:</span> {issue.category}</p>
      <p className="text-sm text-slate-500 mb-4"><span className="font-semibold text-slate-700">By:</span> {issue.author}</p>
      
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-600">{issue.timeText}</span>
        <button 
          onClick={onDetails}
          className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
        >
          <Search size={14} /> Details
        </button>
      </div>
    </div>
  </div>
);

// 3. PROGRESS BAR ITEM
const ProjectFundingItem = ({ title, raised, goal }: { title: string, raised: number, goal: number }) => {
  const percentage = Math.min(100, (raised / goal) * 100);
  
  return (
    <li className="bg-slate-50 p-5 rounded-2xl border-l-4 border-blue-500 mb-4 hover:bg-blue-50/50 transition-colors">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-slate-800">{title}</span>
        <span className="text-xs font-bold text-slate-500">
          ${raised.toLocaleString()} / <span className="text-slate-400">${goal.toLocaleString()}</span>
        </span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", percentage >= 100 ? "bg-emerald-500" : "bg-blue-600")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {percentage >= 100 && (
        <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
          <CheckCircle size={10} /> Goal Met!
        </p>
      )}
    </li>
  );
};

// 4. TIMELINE EVENT
const TimelineEvent = ({ title, resolver, date, align, icon: Icon }: TimelineEventProps) => (
  <div className={cn("relative w-full md:w-1/2 p-4", align === "left" ? "md:pr-12 md:text-right md:left-0" : "md:pl-12 md:text-left md:left-1/2")}>
    <div className={cn(
      "hidden md:flex absolute top-6 w-10 h-10 bg-blue-600 rounded-full items-center justify-center text-white shadow-lg z-10 border-4 border-white",
      align === "left" ? "-right-5" : "-left-5"
    )}>
      <Icon size={16} />
    </div>
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border-t-4 border-blue-600 hover:shadow-md transition-shadow", align === "left" ? "md:mr-auto" : "md:ml-auto")}>
      <h4 className="font-bold text-slate-900 text-lg mb-1">{title}</h4>
      <p className="text-sm text-slate-500 font-medium mb-2">{resolver}</p>
      <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
        {date}
      </span>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---

export default function TransparencyPage() {
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // 1. DATA: Fetch top 4 Resolved issues directly from Shared Data
  const featuredResolved = useMemo(() => {
    return ISSUES_DATA
      .filter(issue => issue.status === "Resolved")
      .slice(0, 4); // Only show top 4
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans pb-20">
      
      {/* HERO */}
      <div className="bg-slate-900 pt-12 pb-24 px-6 text-center relative overflow-hidden rounded-b-[3rem] shadow-2xl mb-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-200 text-xs font-bold mb-6 backdrop-blur-md">
            <ShieldCheck size={14} /> Official Public Ledger
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Sudhaar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Transparency</span> Dashboard
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Empowering the community through verifiable data. Every rupee donated and every issue resolved is tracked here in real-time.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 -mt-16 relative z-20">

        {/* 1. KEY STATS */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={AlertCircle} title="Total Reported" value="1,234" color="slate" delay={0} />
            <StatCard icon={CheckCircle} title="Issues Resolved" value="987" color="emerald" delay={100} />
            <StatCard icon={Activity} title="Resolution Rate" value="80%" color="blue" delay={200} />
            <StatCard icon={TrendingUp} title="Active Issues" value="150" color="amber" delay={300} />
          </div>
        </section>

        {/* 2. PROOF OF RESOLUTION GALLERY */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Proof of Resolution</h2>
              <p className="text-slate-500 mt-2">Visual evidence of completed civic works.</p>
            </div>
            <button 
              onClick={() => navigate('/archive')}
              className="hidden sm:flex items-center gap-2 text-blue-600 font-bold hover:underline"
            >
              View All Archive <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredResolved.map((issue) => (
              <ResolvedCard 
                key={issue.id}
                issue={issue}
                onDetails={() => setSelectedIssue(issue)} 
              />
            ))}
          </div>
        </section>

        {/* --- TRUST & VERIFICATION BANNER --- */}
        <section className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-600/30 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-blue-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-lg">
              <Building2 size={14} /> Authorized Partners
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
              Verified NGOs & Municipal Departments
            </h2>
            
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              The financial data displayed below reflects funds managed directly by our 
              <span className="text-white font-bold mx-1">Registered NGOs</span> and 
              <span className="text-white font-bold mx-1">Municipal Departments</span>. 
              Rest assured, 100% of your donations are securely routed to the specific campaigns run by these organizations.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-400">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <Landmark size={16} className="text-emerald-400" /> Government Audited
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <ShieldCheck size={16} className="text-blue-400" /> Secure Routing
              </div>
            </div>
          </div>
        </section>

        {/* 3. FINANCE & FUNDING (Full Width) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Row: Financial Overview */}
          <div className="lg:col-span-3">
             <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                   <div className="relative z-10">
                     <p className="text-blue-100 font-bold text-sm uppercase mb-2">Total Funds Donated</p>
                     <h3 className="text-4xl font-black">$65,000</h3>
                   </div>
                   <HandCoins className="absolute right-4 bottom-4 text-white/10 h-32 w-32" />
                </div>
                <div className="flex-1 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                   <div>
                     <p className="text-slate-500 font-bold text-sm uppercase mb-2">Funds Utilized</p>
                     <h3 className="text-3xl font-black text-slate-800">$48,000</h3>
                   </div>
                   <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                      <Wrench />
                   </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex items-center justify-between">
                   <div>
                     <p className="text-slate-500 font-bold text-sm uppercase mb-2">Available Balance</p>
                     <h3 className="text-3xl font-black text-emerald-600">$17,000</h3>
                   </div>
                   <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <Wallet />
                   </div>
                </div>
             </div>
          </div>

          {/* Bottom Row: Active Projects List (Full Width) */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-lg p-8">
             <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Activity className="text-blue-600" /> Active Project Funding
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProjectFundingItem title="Pothole Repair, Main Street" raised={3500} goal={5000} />
                <ProjectFundingItem title="Sanitation Drive, Block C" raised={1350} goal={3000} />
                <ProjectFundingItem title="Water Pipeline Fix, Park Road" raised={2400} goal={2500} />
                <ProjectFundingItem title="School Wall Painting" raised={500} goal={5000} />
             </div>
             <p className="text-center text-xs text-slate-400 mt-8 flex items-center justify-center gap-1 border-t border-slate-100 pt-6">
               <ShieldCheck size={12} /> All financial data is verified and audited regularly.
             </p>
          </div>

        </section>

        {/* 4. TIMELINE */}
        <section className="pb-12">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900">Recent Milestones</h2>
           </div>
           
           <div className="relative max-w-4xl mx-auto">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -ml-[1px]"></div>
              <div className="space-y-8">
                 <TimelineEvent 
                   align="left" 
                   title="Major Road Reconstruction" 
                   resolver="National Infrastructure Agency" 
                   date="Dec 10, 2025" 
                   icon={Wrench}
                 />
                 <TimelineEvent 
                   align="right" 
                   title="Street Lighting Upgraded" 
                   resolver="Local Electricity Board" 
                   date="Nov 28, 2025" 
                   icon={Calendar}
                 />
                 <TimelineEvent 
                   align="left" 
                   title="Sanitation Drive Completed" 
                   resolver="Community Volunteers" 
                   date="Nov 15, 2025" 
                   icon={Check}
                 />
              </div>
           </div>
        </section>
      </div>

      {/* --- MODAL --- */}
      <TransparencyDetailModal issue={selectedIssue as any} onClose={() => setSelectedIssue(null)} />
    </div>
  );
}