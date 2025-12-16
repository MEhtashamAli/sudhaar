export type IssueStatus = "Pending" | "Verified" | "In Progress" | "Resolved" | "Critical" | "Open";

// --- ADDED THIS INTERFACE ---
export interface Comment {
  id: string;
  user: string;
  avatar?: string;
  role: "Citizen" | "Official";
  text: string;
  time: string;
}

export interface Issue {
  id: string | number;
  title: string;
  status: IssueStatus;
  category: string;
  priority?: "Low" | "Medium" | "High";
  
  // Basic Display Info
  image?: string;
  author?: string;
  location?: string;
  timeText?: string;
  
  // Detailed Info
  description?: string;
  officialNote?: string | null;
  updates?: any[];
  
  // Transparency Fields
  targetAmount?: number;
  raisedAmount?: number;
  donorsCount?: number;
  createdAt?: string;

  // Extra Fields
  avatar?: string;
  votes?: number;
  distance?: number;
  timestamp?: number;
  initialComments?: Comment[]; // Updated to use the Comment interface
}