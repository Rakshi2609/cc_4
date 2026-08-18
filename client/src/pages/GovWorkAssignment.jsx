import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Users, Target, ClipboardList, CheckCircle2,
    Clock, AlertCircle, ChevronRight, Upload,
    MapPin, User, ArrowRight, ShieldCheck,
    Briefcase, Activity, Sparkles, RefreshCw, Check, X, Image as ImageIcon, Camera
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

const imgUrl = (u) => {
    if (!u || u === '') return null;
    if (u.startsWith('http')) return u;
    return `http://localhost:5000${u.startsWith('/') ? '' : '/'}${u}`;
};

export default function GovWorkAssignment() {
    const [issues, setIssues] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [assigning, setAssigning] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [afterImage, setAfterImage] = useState(null);
    const [afterPreview, setAfterPreview] = useState(null);
    const [notification, setNotification] = useState(null);

    const showToast = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 5000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issueRes, workerRes] = await Promise.all([
                api.get('/issues'),
                api.get('/issues/users/assignable'),
            ]);
            
            const fetchedIssues = issueRes.data.issues || [];
            setIssues(fetchedIssues);
            
            let fetchedWorkers = workerRes.data || [];
            if (fetchedWorkers.length === 0) {
                fetchedWorkers = [
                    { _id: 'squad-roads-1', name: 'BBMP Ward 12 Road Repair Squad', email: 'roads.squad1@bbmp.gov.in', role: 'government' },
                    { _id: 'squad-electric-1', name: 'BESCOM Power & Grid Crew A', email: 'electrical@bescom.gov.in', role: 'government' },
                    { _id: 'squad-water-1', name: 'BWSSB Water & Pipeline Team 4', email: 'water.ops@bwssb.gov.in', role: 'government' },
                    { _id: 'squad-sanitation-1', name: 'Solid Waste Rapid Response Unit', email: 'sanitation@smartcities.gov.in', role: 'government' }
                ];
            }
            setWorkers(fetchedWorkers);

            if (selectedIssue) {
                const refreshed = fetchedIssues.find(i => i._id === selectedIssue._id);
                if (refreshed) setSelectedIssue(refreshed);
            }
        } catch (err) {
            console.error('Error fetching work data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAfterImage(file);
            setAfterPreview(URL.createObjectURL(file));
        }
    };

    const removeSelectedPhoto = () => {
        setAfterImage(null);
        if (afterPreview) {
            URL.revokeObjectURL(afterPreview);
            setAfterPreview(null);
        }
    };

    const handleAssign = async () => {
        if (!selectedIssue || !selectedWorker) return;
        setAssigning(true);
        try {
            const res = await api.post(`/issues/${selectedIssue._id}/assign`, { userId: selectedWorker });
            showToast('Squad assigned successfully! AI repair plan generated.');
            setSelectedWorker('');
            
            if (res.data) {
                setSelectedIssue(res.data);
            }
            fetchData();
        } catch (err) {
            console.error('Assignment error:', err);
            const msg = err.response?.data?.message || 'Assignment failed. Please check network/server.';
            showToast(msg, 'error');
        } finally {
            setAssigning(false);
        }
    };

    const handleResolve = async (issueId) => {
        if (!afterImage) {
            showToast('Please select a resolution photo proof first.', 'error');
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('image', afterImage);

        try {
            const res = await api.post(`/issues/${issueId}/resolve`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showToast('Resolution proof uploaded! Ticket marked as resolved.');
            removeSelectedPhoto();
            if (res.data) {
                setSelectedIssue(res.data);
            }
            fetchData();
        } catch (err) {
            console.error('Resolution upload error:', err);
            const msg = err.response?.data?.message || 'Resolution upload failed. Please try again.';
            showToast(msg, 'error');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-mono text-xs text-slate-400 animate-pulse">
                INITIALIZING WORKFORCE TELEMETRY...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans relative">
            {/* Toast Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl border flex items-center gap-3 text-xs font-bold transition-all animate-bounce ${
                    notification.type === 'error'
                        ? 'bg-rose-50 text-rose-800 border-rose-200 shadow-rose-500/10'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-500/10'
                }`}>
                    {notification.type === 'error' ? <AlertCircle size={18} className="text-rose-600 flex-shrink-0" /> : <Check size={18} className="text-emerald-600 flex-shrink-0" />}
                    <span>{notification.msg}</span>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-slate-200/90 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Municipal Work Assignment</h1>
                        <p className="text-xs text-slate-500">Field Squad Dispatch &amp; AI Resolution Verification</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Unassigned</p>
                        <p className="text-xl font-extrabold font-mono text-rose-600">{issues.filter(i => !i.assignedTo).length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">In Progress</p>
                        <p className="text-xl font-extrabold font-mono text-amber-600">{issues.filter(i => i.status === 'in-progress').length}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Resolved</p>
                        <p className="text-xl font-extrabold font-mono text-emerald-600">{issues.filter(i => i.status === 'resolved').length}</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Issues List (Left 1/3) */}
                <div className="w-full md:w-96 border-r border-slate-200/90 bg-white overflow-y-auto max-h-[calc(100vh-80px)]">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Municipal Tickets</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{issues.length}</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {issues.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400">No active tickets found.</div>
                        ) : (
                            issues.map(issue => {
                                const isSelected = selectedIssue?._id === issue._id;
                                const assignedWorker = workers.find(w => w._id === issue.assignedTo);
                                return (
                                    <div
                                        key={issue._id}
                                        onClick={() => setSelectedIssue(issue)}
                                        className={`p-4 cursor-pointer transition-all border-l-4 ${
                                            isSelected
                                                ? 'bg-orange-50/60 border-orange-500'
                                                : 'hover:bg-slate-50 border-transparent'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3 className="text-xs font-bold text-[#0F172A] truncate flex-1 pr-2">{issue.title}</h3>
                                            <StatusBadge status={issue.status} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">{issue.category}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{new Date(issue.createdAt).toLocaleDateString('en-IN')}</span>
                                            {issue.assignedTo && (
                                                <span className="ml-auto text-[10px] font-mono text-orange-600 font-bold flex items-center gap-1">
                                                    <User size={11} /> {assignedWorker?.name || 'Assigned'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Assignment & Details Panel (Right side) */}
                <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 sm:p-8">
                    {selectedIssue ? (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full">
                                                TICKET #{selectedIssue._id.slice(-6).toUpperCase()}
                                            </span>
                                            {selectedIssue.aiVerified && (
                                                <span className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                                                    <ShieldCheck size={11} /> MISTRAL AI VERIFIED
                                                </span>
                                            )}
                                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full uppercase">
                                                Status: {selectedIssue.status}
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">{selectedIssue.title}</h2>
                                        <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">{selectedIssue.description}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Severity</p>
                                        <p className="text-2xl font-extrabold font-mono text-orange-600">{selectedIssue.severityScore || 0}%</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Original Hazard Photo</p>
                                        {selectedIssue.imageUrl ? (
                                            <img src={imgUrl(selectedIssue.imageUrl)} alt="Before" className="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                                        ) : (
                                            <div className="w-full h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400">
                                                No photo attached
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mistral AI Repair Strategy</p>
                                        <div className="bg-slate-50 rounded-2xl p-4 h-48 border border-slate-200/80 overflow-y-auto">
                                            {selectedIssue.aiWorkPlan && selectedIssue.aiWorkPlan.length > 0 ? (
                                                <div className="space-y-2.5">
                                                    {selectedIssue.aiWorkPlan.map((step, i) => (
                                                        <div key={i} className="flex gap-2.5">
                                                            <span className="text-xs font-black text-orange-600 mt-0.5">{i + 1}.</span>
                                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">Assign a municipal squad to view the tailored AI repair strategy.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-6">
                                    {/* Worker Assignment Controls */}
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-orange-600" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                                    {selectedIssue.assignedTo ? 'Reassign / Change Maintenance Crew' : 'Assign Municipal Maintenance Crew'}
                                                </span>
                                            </div>
                                            {selectedIssue.assignedTo && (
                                                <span className="text-[11px] font-mono text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full font-bold">
                                                    Current: {workers.find(w => w._id === selectedIssue.assignedTo)?.name || 'Assigned'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <select
                                                value={selectedWorker}
                                                onChange={(e) => setSelectedWorker(e.target.value)}
                                                className="flex-1 bg-white border border-slate-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all cursor-pointer"
                                            >
                                                <option value="">Select a municipal engineer or field squad...</option>
                                                {workers.map(w => (
                                                    <option key={w._id} value={w._id}>{w.name} ({w.email || w.role})</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={handleAssign}
                                                disabled={!selectedWorker || assigning}
                                                className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 cursor-pointer"
                                            >
                                                <span>{assigning ? 'Assigning...' : 'Confirm Assignment'}</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Resolution Proof Upload Section (Active whenever issue is not resolved) */}
                                    {selectedIssue.status !== 'resolved' ? (
                                        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Camera size={18} className="text-emerald-600" />
                                                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A]">Upload Resolution Proof &amp; Close Ticket</h3>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                    AI Verified Verification
                                                </span>
                                            </div>

                                            {afterPreview ? (
                                                <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 p-2">
                                                    <img src={afterPreview} alt="Resolution Preview" className="w-full h-52 object-cover rounded-xl" />
                                                    <button
                                                        onClick={removeSelectedPhoto}
                                                        className="absolute top-4 right-4 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors cursor-pointer"
                                                        title="Remove photo"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <p className="text-[11px] font-medium text-slate-600 mt-2 px-1">Selected: {afterImage?.name}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <input
                                                        type="file"
                                                        id="resolution-file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="resolution-file"
                                                        className="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50/60 hover:bg-orange-50/30 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                                    >
                                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-orange-600 group-hover:scale-110 transition-all mb-2">
                                                            <Upload size={22} />
                                                        </div>
                                                        <p className="text-xs font-bold text-slate-700 group-hover:text-orange-700">Click to capture or upload after-repair photo</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WebP up to 5MB</p>
                                                    </label>
                                                </div>
                                            )}

                                            <div className="flex justify-end pt-2">
                                                <button
                                                    onClick={() => handleResolve(selectedIssue._id)}
                                                    disabled={!afterImage || uploading}
                                                    className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <RefreshCw size={14} className="animate-spin" />
                                                            <span>Verifying &amp; Uploading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 size={16} />
                                                            <span>Submit Resolution Proof</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-3">
                                            <CheckCircle2 size={44} className="text-emerald-600 mx-auto" />
                                            <h4 className="text-lg font-extrabold text-emerald-800">Issue Successfully Resolved &amp; Verified</h4>
                                            <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                                                {selectedIssue.governmentRemarks || 'AI quality control comparison and municipal repair confirmation recorded.'}
                                            </p>
                                            {selectedIssue.resolutionPhotoUrl && (
                                                <div className="mt-4 max-w-sm mx-auto">
                                                    <img src={imgUrl(selectedIssue.resolutionPhotoUrl)} alt="Resolved Proof" className="w-full h-44 object-cover rounded-2xl border border-emerald-200 shadow-sm" />
                                                    <p className="text-[10px] text-emerald-700 font-mono font-bold mt-1.5 uppercase">Verified Resolution Proof</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-24">
                            <div className="w-16 h-16 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mb-4 text-orange-600">
                                <Target size={28} />
                            </div>
                            <h3 className="text-base font-bold text-[#0F172A]">Select a ticket from the left queue</h3>
                            <p className="text-xs text-slate-500 mt-1">Assign maintenance squads, review AI work plans, and upload resolution proof</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
