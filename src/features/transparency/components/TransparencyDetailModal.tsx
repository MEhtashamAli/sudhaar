import { useEffect } from "react";
import { CheckCircle2, X, Calendar, MapPin, Tag, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. Interface for Transparency Issue
interface TransparencyIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: "Pending" | "Verified" | "In Progress" | "Resolved" | "Rejected";
  imageUrl?: string;
  afterImageUrl?: string; // Added field for "After" image if resolved
  createdAt: string;
  resolutionDate?: string;
  resolutionNotes?: string;
}

interface IssueDetailModalProps {
  issue: TransparencyIssue | null;
  onClose: () => void;
}

export default function IssueDetailModal({ issue, onClose }: IssueDetailModalProps) {
  
  useEffect(() => {
    if (issue) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [issue]);

  if (!issue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT: Image Section */}
        <div className="relative w-full md:w-1/2 bg-slate-100 flex flex-col">
           <div className="h-64 md:h-full relative group">
             {/* Show "After" image if resolved, otherwise show original */}
             {issue.status === "Resolved" && issue.afterImageUrl ? (
               <>
                 <img src={issue.afterImageUrl} alt="Resolved" className="h-full w-full object-cover" />
                 <div className="absolute bottom-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    AFTER
                 </div>
               </>
             ) : (
               issue.imageUrl ? (
                 <img src={issue.imageUrl} alt={issue.title} className="h-full w-full object-cover" />
               ) : (
                 <div className="flex h-full items-center justify-center text-gray-400">No Image</div>
               )
             )}
             
             {/* Status Badge */}
             <div className="absolute top-4 left-4">
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2 text-white",
                  issue.status === "Resolved" ? "bg-emerald-500" :
                  issue.status === "In Progress" ? "bg-blue-500" :
                  "bg-yellow-500"
                )}>
                  {issue.status === "Resolved" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                  {issue.status}
                </span>
             </div>
           </div>
        </div>

        {/* RIGHT: Details Section */}
        <div className="w-full md:w-1/2 flex flex-col bg-white h-full overflow-y-auto">
          <div className="p-8 flex flex-col h-full">
              
              {/* Header Info */}
              <div className="mb-6 border-b border-slate-100 pb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                      <Tag size={12} /> {issue.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                      <MapPin size={12} /> {issue.location}
                  </span>
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{issue.title}</h2>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={14} />
                  <span>Reported on <span className="font-bold text-slate-700">{new Date(issue.createdAt).toLocaleDateString()}</span></span>
                </div>
              </div>

              {/* Description */}
              <div className="flex-1 space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Issue Details</h3>
                    <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p>{issue.description}</p>
                    </div>
                </div>

                {/* RESOLUTION SECTION (Only shows if Resolved) */}
                {issue.status === "Resolved" && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="text-emerald-600 h-5 w-5" />
                            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wide">Resolution Report</h3>
                        </div>
                        <p className="text-sm text-emerald-800 leading-relaxed">
                            {issue.resolutionNotes || "This issue has been verified as resolved by the municipal authority. Repairs have been completed successfully."}
                        </p>
                        {issue.resolutionDate && (
                            <p className="text-xs text-emerald-600 mt-3 font-medium">
                                Resolved on: {new Date(issue.resolutionDate).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                )}
              </div>

              {/* Footer Button */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                >
                  Close Details
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}