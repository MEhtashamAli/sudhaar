import { useState, useEffect } from "react";
import { CheckCircle2, Heart, X, Send, Share2, User, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Issue, IssueStatus, Comment } from "../type";
import { ImageWithFallback } from "../../../components/ui/ImageWithFallback";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function IssueDetailModal({ issue, onClose }: { issue: Issue | null; onClose: () => void }) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [votes, setVotes] = useState(0);
  const [isUpvoted, setIsUpvoted] = useState(false);
  
  // --- NEW: Share State ---
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (issue) {
      document.body.style.overflow = "hidden";
      setComments(issue.initialComments || []);
      setVotes(issue.votes || 0);
      setIsUpvoted(false);
      setIsCopied(false); // Reset share state
      return () => { document.body.style.overflow = "unset"; };
    }
  }, [issue]);

  if (!issue) return null;

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      user: "You (Citizen)",
      avatar: "ME",
      role: "Citizen",
      text: commentText,
      time: "Just now"
    };
    setComments([...comments, newComment]);
    setCommentText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePostComment();
  };

  const handleVote = () => {
    setVotes(prev => isUpvoted ? prev - 1 : prev + 1);
    setIsUpvoted(!isUpvoted);
  };

  // --- NEW: Share Logic ---
  const handleShare = async () => {
    // Construct a shareable link (Simulated for now)
    const shareUrl = `${window.location.origin}/issues/${issue.id}`;
    const shareData = {
      title: `Sudhaar Issue: ${issue.title}`,
      text: `Check out this reported issue in ${issue.location}: ${issue.description}`,
      url: shareUrl,
    };

    try {
      // 1. Try Native Share (Mobile)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 2. Fallback to Copy to Clipboard (Desktop)
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2s
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const statusConfig: Record<IssueStatus, string> = {
  "Open": "bg-gray-500 text-white", // <--- ADD THIS LINE
  "Verified": "bg-emerald-500 text-white",
  "In Progress": "bg-blue-500 text-white",
  "Pending": "bg-amber-500 text-white",
  "Resolved": "bg-slate-500 text-white",
  "Critical": "bg-red-600 text-white animate-pulse",
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        {/* LEFT: Image */}
        <div className="relative w-full lg:w-[55%] bg-slate-100 flex flex-col">
           <div className="h-[300px] lg:h-full relative">
             <ImageWithFallback src={issue.image || ""} alt={issue.title} className="h-full w-full" />
             <div className="absolute top-4 left-4">
                <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur-md flex items-center gap-2", statusConfig[issue.status])}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> {issue.status}
                </span>
             </div>
           </div>
        </div>

        {/* RIGHT: Content */}
        <div className="w-full lg:w-[45%] flex flex-col bg-white h-full max-h-[60vh] lg:max-h-[90vh]">
          <div className="p-6 border-b border-slate-100 shrink-0 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                    {issue.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{issue.author}</h4>
                    <p className="text-xs text-slate-400">{issue.timeText} • {issue.location}</p>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">{issue.title}</h2>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase">
                     {issue.category}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="hidden lg:flex p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                <X className="h-6 w-6" />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-base">{issue.description}</p>
              </div>
              
              <div className="flex items-center gap-4 py-4 border-y border-slate-50 mt-4">
                <button 
                  onClick={handleVote}
                  className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-colors", isUpvoted ? "bg-red-50 text-red-600 border border-red-200" : "bg-slate-50 text-slate-700 hover:bg-slate-100")}
                >
                  <Heart className={cn("h-4 w-4", isUpvoted && "fill-current")} /> {votes} Votes
                </button>
                
                {/* --- UPDATED SHARE BUTTON --- */}
                <button 
                  onClick={handleShare}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                    isCopied 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                      : "bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                  )}
                >
                  {isCopied ? (
                    <><Check className="h-4 w-4" /> Link Copied!</>
                  ) : (
                    <><Share2 className="h-4 w-4" /> Share</>
                  )}
                </button>

              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 mt-6">
                  Comments <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{comments.length}</span>
                </h3>
                
                {comments.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No comments yet. Be the first to verify this!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold border", c.role === "Official" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-slate-100 text-slate-600")}>
                          {c.avatar || <User size={14} />}
                        </div>
                        <div className="flex-1 bg-slate-50 p-3 rounded-2xl rounded-tl-none text-sm border border-slate-100">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                              {c.user} 
                              {c.role === "Official" && <CheckCircle2 size={12} className="text-blue-500"/>}
                            </span>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                          <p className="text-slate-600">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
          </div>
          
          <div className="p-4 border-t border-slate-100 bg-white shrink-0">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Write an official response or comment..." 
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button 
                onClick={handlePostComment}
                disabled={!commentText.trim()}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}