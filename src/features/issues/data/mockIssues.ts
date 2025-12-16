import { Issue } from "../type"; // <--- FIXED IMPORT (Singular)

export const ISSUES_DATA: Issue[] = [
  // --- ACTIVE ISSUES (For Dashboard) ---
  { 
    id: 1, author: "Ali Raza", avatar: "AR", timeText: "2h ago", timestamp: 1700000000, 
    location: "Zafarwal Road", distance: 1.2, title: "Deep Pothole Causing Accidents", 
    description: "Multiple bikers have slipped here. It is right on the turn. Needs immediate filling before more accidents happen.", // <--- FIXED (desc -> description)
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800", 
    votes: 142, status: "Critical", category: "Roads",
    initialComments: []
  },
  { 
    id: 2, author: "Sara Bibi", avatar: "SB", timeText: "5h ago", timestamp: 1699900000, 
    location: "Siddique Pura", distance: 0.5, title: "Choked Sewer Line", 
    description: "Sewage water is entering homes. Reported twice before. The smell is unbearable.", 
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800", 
    votes: 89, status: "In Progress", category: "Sanitation",
    initialComments: []
  },
  { 
    id: 3, author: "Ahmed Khan", avatar: "AK", timeText: "1d ago", timestamp: 1690000000, 
    location: "Railway Station", distance: 2.1, title: "Street Lights Not Working", 
    description: "The main road is pitch black at night. Very dangerous for pedestrians.", 
    image: "https://images.unsplash.com/photo-1555881400-74d7acaacd81?auto=format&fit=crop&q=80&w=800", 
    votes: 204, status: "Pending", category: "Electricity",
    initialComments: []
  },

  // --- RESOLVED ISSUES (For Archive Page) ---
  { 
    id: 101, author: "City Council", avatar: "CC", timeText: "Oct 26, 2025", timestamp: 1680000000, 
    location: "Lahore Main Blvd", distance: 0, title: "Road Resurfacing Complete", 
    description: "The main road pothole has been successfully filled and resurfaced. Traffic flow is now restored to normal capacity.", 
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800", 
    votes: 520, status: "Resolved", category: "Roads",
    initialComments: []
  },
  { 
    id: 102, author: "Green Earth NGO", avatar: "GE", timeText: "Oct 24, 2025", timestamp: 1679000000, 
    location: "Central Park", distance: 0, title: "Park Cleanup Drive Successful", 
    description: "Volunteers gathered to clean the central park. Over 500kg of waste was collected and properly disposed of.", 
    image: "https://images.unsplash.com/photo-1530587191026-aa1e5327602f?auto=format&fit=crop&q=80&w=800", 
    votes: 340, status: "Resolved", category: "Sanitation",
    initialComments: []
  },
  { 
    id: 103, author: "WAPDA Team", avatar: "WT", timeText: "Oct 22, 2025", timestamp: 1678000000, 
    location: "Sector 4", distance: 0, title: "New Street Lights Installed", 
    description: "New LED street lights have been installed in Sector 4, improving night-time visibility and safety for residents.", 
    image: "https://images.unsplash.com/photo-1562519782-b7ca57020d2d?auto=format&fit=crop&q=80&w=800", 
    votes: 210, status: "Resolved", category: "Electricity",
    initialComments: []
  },
  { 
    id: 104, author: "Public Works", avatar: "PW", timeText: "Oct 20, 2025", timestamp: 1677000000, 
    location: "5th Avenue", distance: 0, title: "Water Pipe Burst Repaired", 
    description: "The burst pipeline on 5th Avenue has been repaired. Water supply has been fully restored to the affected neighborhood.", 
    image: "https://images.unsplash.com/photo-1584905066893-7d5c142dd95d?auto=format&fit=crop&q=80&w=800", 
    votes: 180, status: "Resolved", category: "Water",
    initialComments: []
  },
  { 
    id: 105, author: "School Admin", avatar: "SA", timeText: "Oct 15, 2025", timestamp: 1676000000, 
    location: "Govt High School", distance: 0, title: "School Wall Rebuilt", 
    description: "The collapsed boundary wall has been reconstructed using community funds, ensuring student safety.", 
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800", 
    votes: 400, status: "Resolved", category: "Other", 
    initialComments: []
  },
  { 
    id: 106, author: "Transit Auth", avatar: "TA", timeText: "Oct 10, 2025", timestamp: 1675000000, 
    location: "Bus Stop 7", distance: 0, title: "Bus Stop Shelter Installed", 
    description: "A new shelter has been installed to protect commuters from the sun and rain.", 
    image: "https://images.unsplash.com/photo-1520105072000-f44fc083e508?auto=format&fit=crop&q=80&w=800", 
    votes: 150, status: "Resolved", category: "Roads", 
    initialComments: []
  }
];