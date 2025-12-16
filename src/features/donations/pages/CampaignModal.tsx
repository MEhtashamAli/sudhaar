import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, TrendingUp, CreditCard, Wallet, 
  Lock, CheckCircle2, Heart, Leaf, AlertCircle 
} from 'lucide-react';
import { ImageWithFallback } from '../../../components/ui/ImageWithFallback';

interface Campaign {
  id: string;
  title: string;
  ngo: string;
  image: string;
  raised: number;
  goal: number;
  donors: number;
  desc: string;
  zakatEligible?: boolean;
  budget: { item: string; cost: number; funded: number }[];
}

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const PRESET_AMOUNTS = [1000, 3000, 5000, 10000];

export default function CampaignModal({ isOpen, onClose, campaign }: CampaignModalProps) {
  // Donation State
  const [amount, setAmount] = useState<number | string>(3000);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'jazzcash' | 'easypaisa'>('card');
  const [isZakat, setIsZakat] = useState(false);
  
  // Payment Details State
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  
  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Live Data State (For immediate update effect)
  const [currentRaised, setCurrentRaised] = useState(0);
  const [currentDonors, setCurrentDonors] = useState(0);

  // Sync state when modal opens
  useEffect(() => {
    if (campaign) {
      setCurrentRaised(campaign.raised);
      setCurrentDonors(campaign.donors);
      // Reset form
      setError("");
      setCardNumber("");
      setMobileNumber("");
    }
  }, [campaign, isOpen]);

  if (!isOpen || !campaign) return null;

  const percent = Math.min(100, Math.round((currentRaised / campaign.goal) * 100));

  // --- VALIDATION LOGIC ---
  const validatePayment = () => {
    const amt = Number(amount);
    if (isNaN(amt) || amt < 100) {
      setError("Minimum donation amount is PKR 100.");
      return false;
    }

    if (paymentMethod === 'card') {
      // Basic check: 16 digits for card
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (cleanCard.length !== 16 || isNaN(Number(cleanCard))) {
        setError("Please enter a valid 16-digit card number.");
        return false;
      }
      if (!expiryDate || !cvc) {
        setError("Please complete all card details.");
        return false;
      }
    } else {
      // Basic check: Pakistan mobile number (03XX...)
      const cleanMobile = mobileNumber.replace(/[- ]/g, "");
      if (!/^03\d{9}$/.test(cleanMobile)) {
        setError(`Please enter a valid ${paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} number (03...).`);
        return false;
      }
    }
    
    setError("");
    return true;
  };

  const handleDonate = () => {
    if (!validatePayment()) return;

    setIsProcessing(true);
    
    // Simulate API Transaction
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Update the UI immediately to show impact
      setCurrentRaised(prev => prev + Number(amount));
      setCurrentDonors(prev => prev + 1);
    }, 2500);
  };

  const resetAndClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          onClick={resetAndClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" 
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
            <div>
              <h2 className="text-lg font-black text-slate-900 line-clamp-1">{campaign.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck size={10} /> Verified NGO
                 </span>
                 {campaign.zakatEligible && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Leaf size={10} /> Zakat Eligible
                    </span>
                 )}
              </div>
            </div>
            <button onClick={resetAndClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-600" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 bg-slate-50/50 custom-scrollbar">
            <div className="flex flex-col lg:flex-row h-full">
              
              {/* LEFT: Content Details */}
              <div className="flex-1 p-6 lg:p-8 space-y-6">
                <div className="rounded-2xl overflow-hidden shadow-sm h-56 relative">
                  <ImageWithFallback src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg">{campaign.ngo}</p>
                    <p className="text-xs text-slate-300">Registered Non-Profit • Reg #4421-B</p>
                  </div>
                </div>

                <div className="prose prose-sm prose-slate max-w-none">
                    <h3 className="text-slate-900 font-bold text-lg mb-2">About this campaign</h3>
                    <p className="text-slate-600 leading-relaxed">{campaign.desc}</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <TrendingUp size={16} className="text-blue-600" /> Budget Transparency
                  </h4>
                  <div className="space-y-3">
                    {campaign.budget.map((b, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                          <span>{b.item}</span>
                          <span>PKR {b.cost.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((b.funded/b.cost)*100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Payment Form */}
              <div className="w-full lg:w-[420px] bg-white border-l border-slate-100 p-6 lg:p-8 flex flex-col">
                 
                 {/* Live Funding Status */}
                 <div className="mb-6 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Raised</p>
                    <motion.p 
                      key={currentRaised} // Triggers animation on change
                      initial={{ scale: 1.2, color: "#10b981" }}
                      animate={{ scale: 1, color: "#0f172a" }} 
                      className="text-3xl font-black text-slate-900"
                    >
                      PKR {currentRaised.toLocaleString()}
                    </motion.p>
                    <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden my-3">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-blue-500" />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>{percent}% funded</span>
                      <span>{currentDonors} Donors</span>
                    </div>
                 </div>

                 {/* Payment Form Area */}
                 <div className="space-y-5 flex-1">
                    
                    {/* Amount Selector */}
                    <div className="grid grid-cols-2 gap-2">
                        {PRESET_AMOUNTS.map(amt => (
                            <button key={amt} onClick={() => setAmount(amt)} className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${amount === amt ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
                                {amt.toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">PKR</span>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    {/* Payment Method Tabs */}
                    <div className="flex gap-2">
                        {['card', 'jazzcash', 'easypaisa'].map((method) => (
                            <button key={method} onClick={() => {setPaymentMethod(method as any); setError("")}} className={`flex-1 py-2 rounded-lg border flex flex-col items-center justify-center transition-all ${paymentMethod === method ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
                                {method === 'card' ? <CreditCard size={16} /> : <Wallet size={16} />}
                                <span className="text-[10px] font-bold mt-1 capitalize">{method}</span>
                            </button>
                        ))}
                    </div>

                    {/* CONDITIONAL INPUTS BASED ON METHOD */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-2">
                      {paymentMethod === 'card' ? (
                        <div className="space-y-3">
                          <input 
                            type="text" placeholder="Card Number (16 digits)" maxLength={16}
                            value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                          />
                          <div className="flex gap-3">
                            <input 
                              type="text" placeholder="MM/YY" maxLength={5}
                              value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            />
                            <input 
                              type="text" placeholder="CVC" maxLength={3}
                              value={cvc} onChange={(e) => setCvc(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-500 uppercase">Enter {paymentMethod} Mobile Number</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">+92</span>
                            <input 
                              type="text" placeholder="300 1234567" maxLength={11}
                              value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)}
                              className="w-full pl-12 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-medium"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400">You will receive an OTP on this number to confirm the transaction.</p>
                        </div>
                      )}
                    </div>

                    {/* Zakat Checkbox */}
                    {campaign.zakatEligible && (
                        <div onClick={() => setIsZakat(!isZakat)} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isZakat ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'}`}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${isZakat ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`}>
                                {isZakat && <CheckCircle2 size={14} className="text-white" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Mark as Zakat</p>
                                <p className="text-[10px] text-slate-500">100% of this amount will go to Zakat-eligible beneficiaries.</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-3 rounded-lg">
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}
                 </div>

                 <button onClick={handleDonate} disabled={isProcessing} className="w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isProcessing ? "Processing Payment..." : "Donate Now"}
                    {!isProcessing && <Heart size={16} className="fill-white/20" />}
                 </button>
                 
                 <p className="text-[10px] text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <Lock size={10} /> Secure SSL Transaction
                 </p>
              </div>
            </div>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 size={48} className="text-emerald-600" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 mb-2">Thank You!</h3>
                 <p className="text-slate-500 font-medium mb-8 max-w-xs">
                   Your contribution of <span className="text-slate-900 font-bold">PKR {Number(amount).toLocaleString()}</span> has been successfully added to the campaign.
                 </p>
                 <button onClick={resetAndClose} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                   Return to Campaigns
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}