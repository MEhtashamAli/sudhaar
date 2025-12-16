import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Camera, MapPin, ArrowRight, ArrowLeft, 
  CheckCircle2, AlertTriangle, Droplets, Zap, 
  Truck, Construction, Loader2, Search, Crosshair 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LEAFLET IMPORTS ---
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

// --- CUSTOM MARKER ICON ---
const customMarkerIcon = L.divIcon({
  className: 'custom-marker',
  html: renderToStaticMarkup(
    <div className="relative">
      <div className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white relative z-10">
        <MapPin size={20} fill="currentColor" />
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rotate-45 transform"></div>
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 blur-sm rounded-full"></div>
    </div>
  ),
  iconSize: [40, 50],
  iconAnchor: [20, 50],
});

// --- Categories Configuration ---
const CATEGORIES = [
  { id: 'roads', label: 'Roads', icon: Construction, color: 'bg-orange-500' },
  { id: 'sanitation', label: 'Sanitation', icon: Truck, color: 'bg-emerald-500' },
  { id: 'water', label: 'Water', icon: Droplets, color: 'bg-blue-500' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: 'bg-yellow-500' },
  { id: 'other', label: 'Other', icon: AlertTriangle, color: 'bg-slate-500' },
];

// --- HELPER: UPDATE MAP CENTER ---
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 16, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

// --- HELPER: CLICK TO PIN ---
function LocationMarker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  // Map State
  const [mapCenter, setMapCenter] = useState<[number, number]>([31.5204, 74.3587]); // Default: Lahore
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    locationName: '', 
    coordinates: '',
    image: null as File | null
  });

  const handleClose = () => {
    setStep(1);
    setIsSubmitting(false);
    setFormData({ category: '', title: '', description: '', locationName: '', coordinates: '', image: null });
    setMarkerPos(null);
    setSearchQuery("");
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(3);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // --- 1. SEARCH FUNCTIONALITY ---
  const handleSearch = async (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      // Appending Pakistan to context, can be removed if global search needed
      const query = `${searchQuery}`; 
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos: [number, number] = [parseFloat(lat), parseFloat(lon)];
        
        setMapCenter(newPos);
        setMarkerPos(newPos);
        setFormData(prev => ({
          ...prev,
          locationName: display_name.split(',')[0], // Extract just the main name
          coordinates: `${parseFloat(lat).toFixed(6)}, ${parseFloat(lon).toFixed(6)}`
        }));
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // --- 2. GEOLOCATION (LOCATE ME) ---
  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const newPos: [number, number] = [latitude, longitude];
        
        setMapCenter(newPos);
        setMarkerPos(newPos);
        
        // Reverse geocode current location
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            setFormData(prev => ({
                ...prev,
                locationName: data.display_name ? data.display_name.split(',')[0] : "My Location",
                coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
        } catch (e) {
            setFormData(prev => ({
                ...prev,
                locationName: "My Current Location",
                coordinates: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
        }
        
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  // --- 3. CLICK MAP HANDLER (With Reverse Geocoding) ---
  const onMapClick = async (lat: number, lng: number) => {
    setMarkerPos([lat, lng]);
    setIsReverseGeocoding(true);
    
    setFormData(prev => ({
        ...prev, 
        coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        locationName: "Fetching address..." 
    }));

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        if (data && data.display_name) {
            // Get the first two parts of the address for better context
            const addressParts = data.display_name.split(',').slice(0, 2).join(',');
            setFormData(prev => ({
                ...prev,
                locationName: addressParts,
            }));
        } else {
             setFormData(prev => ({ ...prev, locationName: "Marked Location" }));
        }
    } catch (error) {
        setFormData(prev => ({ ...prev, locationName: "Marked Location" }));
    } finally {
        setIsReverseGeocoding(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 font-sans">
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[99999]"
          >
            
            {/* --- HEADER --- */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Report Issue</h2>
                <p className="text-slate-500 text-sm">Submit a new civic problem for review</p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* --- BODY CONTENT --- */}
            <div className="p-8 overflow-y-auto custom-scrollbar bg-white">
              
              {/* STEP 1: DETAILS */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">1. Select Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 h-32 ${formData.category === cat.id ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'}`}
                        >
                          <div className={`p-3 rounded-full mb-3 text-white ${cat.color}`}><cat.icon size={24} /></div>
                          <span className="font-bold text-slate-800">{cat.label}</span>
                          {formData.category === cat.id && <div className="absolute top-3 right-3 text-blue-500"><CheckCircle2 size={18} fill="currentColor" className="text-white" /></div>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">2. Issue Title</label>
                      <input type="text" placeholder="e.g. Broken Street Light" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">3. Description</label>
                      <textarea rows={3} placeholder="Describe the problem details here..." className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: EVIDENCE & MAP */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  
                  {/* --- MAP SECTION --- */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">4. Location</label>
                    
                    {/* Search Bar & Locate Button */}
                    <div className="flex gap-2 relative z-10">
                        <div className="relative flex-1">
                            <form onSubmit={handleSearch}>
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                                <input 
                                    type="text" 
                                    placeholder="Search street, area..." 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>
                        <button 
                            onClick={handleLocateMe}
                            disabled={isLocating}
                            className="px-4 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center tooltip"
                            title="Use my location"
                        >
                            {isLocating ? <Loader2 className="animate-spin h-5 w-5" /> : <Crosshair className="h-5 w-5" />}
                        </button>
                        <button 
                            onClick={handleSearch}
                            disabled={isSearching}
                            className="px-6 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 disabled:opacity-70 transition-colors flex items-center justify-center"
                        >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                        </button>
                    </div>

                    {/* Map Container */}
                    <div className="relative w-full h-72 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-inner z-0 bg-slate-100">
                        {/* Loading Overlay for Map Operations */}
                        {(isSearching || isLocating || isReverseGeocoding) && (
                            <div className="absolute inset-0 z-[500] bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                                <div className="bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                                    <span className="text-xs font-bold text-slate-700">Updating location...</span>
                                </div>
                            </div>
                        )}

                        <MapContainer 
                            center={mapCenter} 
                            zoom={15} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            {/* UPGRADED TILE LAYER: CartoDB Voyager (Much cleaner than OSM) */}
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                            
                            <MapUpdater center={mapCenter} />
                            <LocationMarker onLocationSelect={onMapClick} />
                            
                            {markerPos && <Marker position={markerPos} icon={customMarkerIcon}></Marker>}
                        </MapContainer>
                        
                        {!markerPos && !isLocating && (
                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur text-slate-600 text-xs font-bold px-4 py-2 rounded-full shadow-lg pointer-events-none z-[400]">
                                 Tap anywhere on map to pin
                             </div>
                        )}
                    </div>

                    {/* Coordinates Feedback */}
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                        <div className="flex items-center gap-1.5">
                            <MapPin className={`h-3.5 w-3.5 ${formData.coordinates ? 'text-blue-500' : 'text-slate-400'}`} />
                            <span className="font-medium truncate max-w-[250px]">{formData.locationName || formData.coordinates || "No location selected yet"}</span>
                        </div>
                        {formData.coordinates && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-mono">{formData.coordinates}</span>}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">5. Evidence Photo</label>
                    <div onClick={() => fileInputRef.current?.click()} className={`relative w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${formData.image ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:bg-white hover:border-blue-400'}`}>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      {formData.image ? (<><div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-2"><CheckCircle2 size={20} /></div><p className="font-bold text-emerald-700 text-sm">{formData.image.name}</p></>) : (<><div className="h-10 w-10 bg-white text-blue-500 rounded-xl shadow-sm flex items-center justify-center mb-2"><Camera size={20} /></div><p className="font-bold text-slate-600 text-sm">Click to Upload Photo</p></>)}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center">
                  <div className="h-28 w-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-200"><CheckCircle2 size={64} /></div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Report Submitted!</h3>
                  <p className="text-slate-500 text-lg mb-8 max-w-sm">Thank you! Your issue has been successfully reported to the Narowal Municipal Authorities.</p>
                  <button onClick={handleClose} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">Close & Return to Dashboard</button>
                </motion.div>
              )}
            </div>

            {/* --- FOOTER --- */}
            {step < 3 && (
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center sticky bottom-0 z-20">
                {step > 1 ? (<button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors px-4 py-2"><ArrowLeft size={20} /> Back</button>) : (<div />)}
                <button 
                  onClick={step === 1 ? () => setStep(2) : handleSubmit} 
                  disabled={step === 1 ? (!formData.title || !formData.category) : (!formData.coordinates || isSubmitting)} 
                  className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 hover:translate-y-[-2px] hover:shadow-blue-500/30'} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
                >
                  {isSubmitting ? (<><Loader2 size={20} className="animate-spin" /> Submitting...</>) : step === 1 ? (<>Next Step <ArrowRight size={20} /></>) : (<>Submit Report <CheckCircle2 size={20} /></>)}
                </button>
              </div>
            )}

            {/* Progress Bar */}
            {step < 3 && (
               <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full z-20">
                 <motion.div className="h-full bg-blue-500" initial={{ width: "0%" }} animate={{ width: step === 1 ? "50%" : "100%" }} transition={{ duration: 0.5 }} />
               </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}