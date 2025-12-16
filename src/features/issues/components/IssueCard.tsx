import React, { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Issue } from "../type"; // <--- FIXED: (singular 'type')
import { ImageWithFallback } from "../../../components/ui/ImageWithFallback";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1. We accept an onClick prop here
export const IssueCard = React.memo(({ issue, onClick, priority = false }: { issue: Issue; onClick: () => void; priority?: boolean }) => {
  // <--- FIXED: Add fallback '|| 0' so TypeScript knows this is a number
  const [votes, setVotes] = useState(issue.votes || 0); 
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleVote = (e: React.MouseEvent) => {
    // 2. IMPORTANT: Stop the click from opening the modal when just voting
    e.stopPropagation(); 
    // <--- FIXED: Explicitly tell TS that 'v' is a number
    setVotes((v: number) => isUpvoted ? v - 1 : v + 1);
    setIsUpvoted(!isUpvoted);
  };

  const statusColor = issue.status === "Verified" ? "bg-emerald-500" : issue.status === "Critical" ? "bg-red-600 animate-pulse" : "bg-amber-500";

  return (
    <article 
      onClick={onClick} // 3. THIS opens the modal
      className="group cursor-pointer flex flex-col h-full bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {/* <--- FIXED: Added fallback for image */}
        <ImageWithFallback src={issue.image || ""} alt={issue.title} className="h-full w-full group-hover:scale-105 transition-transform duration-700" priority={priority} />
        <div className="absolute top-3 left-3">
          <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm backdrop-blur-md", statusColor)}>
            {issue.status}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
            {/* <--- FIXED: Added fallback for avatar */}
            {issue.avatar || "U"}
          </div>
          <span className="text-xs font-bold text-slate-700">{issue.author}</span>
          <span className="text-xs text-slate-400">• {issue.timeText}</span>
        </div>

        <h3 className="font-bold text-lg leading-tight text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {issue.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {/* <--- FIXED: Changed 'desc' to 'description' */}
          {issue.description}
        </p>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            {/* <--- FIXED: Added fallback for location */}
            <MapPin className="h-3 w-3" /> {issue.location || "Unknown Location"}
          </span>
          <button 
            onClick={handleVote}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors", isUpvoted ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-600 hover:bg-slate-100")}
          >
            <Heart className={cn("h-3.5 w-3.5", isUpvoted && "fill-current")} /> {votes}
          </button>
        </div>
      </div>
    </article>
  );
});