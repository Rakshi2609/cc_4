import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Mic, MicOff, MapPin, ArrowLeft, Send, ScanLine, XCircle, CheckCircle2, Sparkles, Camera, HelpCircle, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import CameraCapture from '../components/CameraCapture';

const CATEGORIES = ['Pothole', 'Streetlight', 'Garbage', 'Drainage', 'Water Leakage', 'Others'];

const CAT_COLORS = {
  Pothole: 'border-orange-500 text-orange-800 bg-orange-50/70 shadow-sm ring-1 ring-orange-400/40',
  Streetlight: 'border-amber-500 text-amber-800 bg-amber-50/70 shadow-sm ring-1 ring-amber-400/40',
  Garbage: 'border-emerald-500 text-emerald-800 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-400/40',
  Drainage: 'border-blue-500 text-blue-800 bg-blue-50/70 shadow-sm ring-1 ring-blue-400/40',
  'Water Leakage': 'border-cyan-500 text-cyan-800 bg-cyan-50/70 shadow-sm ring-1 ring-cyan-400/40',
  Others: 'border-slate-500 text-slate-800 bg-slate-100/70 shadow-sm ring-1 ring-slate-400/40',
};

export default function ReportIssue() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', latitude: '', longitude: '', address: '' });
  const [image, setImage] = useState(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceField, setVoiceField] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => { detectLocation(); }, []);

  const startVoice = (field) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError('Voice input is not supported in this browser.'); return; }
    if (listening) { recognitionRef.current?.stop(); setListening(false); setVoiceField(null); return; }
    const r = new SR();
    r.lang = 'en-IN';
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onstart = () => { setListening(true); setVoiceField(field); };
    r.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setForm(f => ({ ...f, [field]: f[field] ? f[field] + ' ' + t : t }));
    };
    r.onerror = () => { setListening(false); setVoiceField(null); };
    r.onend = () => { setListening(false); setVoiceField(null); };
    recognitionRef.current = r;
    r.start();
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({ ...f, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setScanning(true);
    setAiResult(null);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      const res = await api.post('/issues', data, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (res.data?.meta) {
        setAiResult(res.data.meta);
        setTimeout(() => navigate('/dashboard?success=1'), 2500);
      } else {
        navigate('/dashboard?success=1');
      }
    } catch (err) {
      setScanning(false);
      setError(err.response?.data?.message || 'Submission failed. Please check details and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans relative">
      {/* Background Glows */}
      <div className="absolute top-10 left-1/3 w-[450px] h-[300px] bg-orange-100/30 blur-[130px] rounded-full pointer-events-none" />

      {/* AI Scan Overlay */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-7 sm:p-9 flex flex-col items-center max-w-md w-full shadow-2xl border border-slate-200"
            >
              {/* Scan viewport */}
              <div className="relative w-52 h-52 mb-6 rounded-2xl overflow-hidden border-2 border-orange-300 bg-slate-950 flex items-center justify-center">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="scan" className="w-full h-full object-cover opacity-90" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 gap-2">
                    <ScanLine size={48} className="animate-pulse text-orange-500" />
                    <span className="text-xs font-mono">Simulating visual audit</span>
                  </div>
                )}

                {/* Laser scan line */}
                {!aiResult && (
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-bounce shadow-lg shadow-orange-500" />
                )}

                {/* Corner reticle brackets */}
                {[['top-2 left-2', 'border-t-2 border-l-2'], ['top-2 right-2', 'border-t-2 border-r-2'], ['bottom-2 left-2', 'border-b-2 border-l-2'], ['bottom-2 right-2', 'border-b-2 border-r-2']].map(([pos, cls]) => (
                  <div key={pos} className={`absolute ${pos} w-4 h-4 ${cls} border-orange-500`} />
                ))}
              </div>

              {aiResult ? (
                <div className="text-center w-full">
                  <div className={`inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border ${
                    aiResult.aiVerified
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-amber-50 border-amber-300 text-amber-700'
                  }`}>
                    {aiResult.aiVerified ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {aiResult.aiVerified ? 'Mistral AI Verified' : 'Unverified Texture'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-3 text-left">
                    <div className="text-xs text-slate-500 font-mono mb-1">Detected Classification</div>
                    <div className="text-base font-bold text-[#0F172A]">
                      {aiResult.aiDetectedCategory || form.category || 'Pothole'}
                    </div>
                    {aiResult.aiNote && (
                      <p className="text-xs text-slate-600 italic mt-2 border-t border-slate-200/80 pt-2">
                        "{aiResult.aiNote}"
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-mono animate-pulse">
                    Routing ticket to Ward Council &rarr; Redirecting...
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-2 text-orange-600 font-bold text-base">
                    <ShieldCheck size={20} className="animate-spin" />
                    <span>Mistral Pixtral Vision Active</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Analyzing pixel depth, defect geometry, and geotag integrity before dispatching work squads...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-5xl">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors mb-5 group cursor-pointer font-bold text-xs"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles size={13} />
                <span>15-Second Instant Dispatch</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Report a Civic Issue
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Upload damage photos, record voice notes, and trigger AI-verified municipal action.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form (8 cols) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  <XCircle size={16} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Issue Title <span className="text-orange-600">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400 font-medium"
                  placeholder="e.g. Deep Pothole on Ring Road near Metro Pillar 142"
                />
                <p className="text-[11px] text-slate-400 mt-1">Provide a concise headline identifying the hazard and location</p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Category <span className="text-orange-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CATEGORIES.map(cat => {
                    const isSelected = form.category === cat;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setForm({ ...form, category: cat })}
                        className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? (CAT_COLORS[cat] || 'border-orange-500 text-orange-900 bg-orange-50')
                            : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description with Voice Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Detailed Description <span className="text-orange-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => startVoice('description')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      listening && voiceField === 'description'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-orange-300'
                    }`}
                  >
                    {listening && voiceField === 'description' ? <MicOff size={13} /> : <Mic size={13} className="text-orange-600" />}
                    <span>{listening && voiceField === 'description' ? 'Stop Listening' : 'Voice Input'}</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50/50 text-slate-900 placeholder:text-slate-400 resize-none font-medium leading-relaxed"
                  placeholder="Describe severity, approximate dimensions, traffic hazard, water stagnation, or urgency..."
                />
              </div>

              {/* Pinpoint Geolocation Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Pinpoint Coordinates</span>
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-orange-600 text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Navigation size={12} className={locating ? 'animate-spin text-orange-600' : 'text-orange-600'} />
                    <span>{locating ? 'Detecting GPS...' : 'Auto-Fill Location'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Latitude</label>
                    <input
                      required
                      value={form.latitude}
                      onChange={e => setForm({ ...form, latitude: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white text-slate-900"
                      placeholder="e.g. 18.5204"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Longitude</label>
                    <input
                      required
                      value={form.longitude}
                      onChange={e => setForm({ ...form, longitude: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs font-mono border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white text-slate-900"
                      placeholder="e.g. 73.8567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Street Address or Landmark (Optional)</label>
                  <input
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white text-slate-900 placeholder:text-slate-400"
                    placeholder="e.g. Opposite City Hospital Main Gate, Ward 14"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting || !form.category}
                className="w-full flex items-center justify-center gap-2.5 bg-[#ea580c] hover:bg-[#c2410c] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-sm font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all cursor-pointer"
              >
                <Send size={17} />
                <span>{submitting ? 'Submitting & Auditing...' : 'Submit Issue for AI Audit'}</span>
              </button>
            </form>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Camera Capture Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Camera size={18} className="text-orange-600" />
                <h3 className="font-bold text-sm text-[#0F172A]">Photo Evidence</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Photos are analyzed by Mistral Vision to compute instant severity and verify authenticity.
              </p>
              <CameraCapture onCapture={f => setImage(f || null)} />
            </div>

            {/* SLA Timeline Card */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} className="text-emerald-600" />
                <h3 className="font-bold text-sm text-[#0F172A]">Redressal SLA Process</h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Mistral Vision Audit</div>
                    <p className="text-slate-500 mt-0.5">Pixel analysis validates severity &amp; authentic hazard snapshot.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">Hotspot Auto-Merge</div>
                    <p className="text-slate-500 mt-0.5">100m proximity tickets group together to elevate ward priority.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">On-Ground Dispatch</div>
                    <p className="text-slate-500 mt-0.5">Engineers receive 4-step repair instructions and resolve SLA.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
