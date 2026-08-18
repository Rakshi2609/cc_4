import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Users, Target, ClipboardList, CheckCircle2,
    Clock, AlertCircle, ChevronRight, Upload,
    MapPin, User, ArrowRight, ShieldCheck,
    Briefcase, Activity, Sparkles, RefreshCw
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
    const [uploading, setUploading] = useState(false);
    const [afterImage, setAfterImage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [issueRes, workerRes] = await Promise.all([
                api.get('/issues'),
                api.get('/issues/users/assignable'),
            ]);
            setIssues(issueRes.data.issues || []);
            setWorkers(workerRes.data || []);
        } catch (err) {
            console.error('Error fetching work data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedIssue || !selectedWorker) return;
        try {
            await api.post(`/issues/${selectedIssue._id}/assign`, { userId: selectedWorker });
            setSelectedIssue(null);
            setSelectedWorker('');
            fetchData();
        } catch (err) {
            alert('Assignment failed');
        }
    };

    const handleResolve = async (issueId) => {
        if (!afterImage) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('image', afterImage);

        try {
            await api.post(`/issues/${issueId}/resolve`, formData);
            setAfterImage(null);
            fetchData();
        } catch (err) {
            const msg = err.response?.data?.message || 'Resolution upload failed';
            alert(msg);
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
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200/90 px-6 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Municipal Work Assignment</h1>
                        <p className="text-xs text-slate-500">Field Squad Dispatch &amp; AI Repair Verification</p>
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
                        {issues.map(issue => {
                            const isSelected = selectedIssue?._id === issue._id;
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
                                                <User size={11} /> {workers.find(w => w._id === issue.assignedTo)?.name || 'Assigned'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
                                                <p className="text-xs text-slate-400 italic">No AI work plan generated yet. Assign a worker to trigger analysis.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {selectedIssue.status === 'pending' ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-orange-600" />
                                                <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Assign Municipal Road / Electrical Squad</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <select
                                                    value={selectedWorker}
                                                    onChange={(e) => setSelectedWorker(e.target.value)}
                                                    className="flex-1 bg-slate-50 border border-slate-300 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
                                                >
                                                    <option value="">Select a municipal engineer / worker...</option>
                                                    {workers.map(w => (
                                                        <option key={w._id} value={w._id}>{w.name} ({w.email})</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAssign}
                                                    disabled={!selectedWorker}
                                                    className="px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-orange-500/25 cursor-pointer"
                                                >
                                                    <span>Confirm Assignment</span>
                                                    <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : selectedIssue.status === 'in-progress' ? (
                                        <div className="space-y-4">
                                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
                                                <div className="flex items-center gap-2 text-amber-800 mb-1">
                                                    <Clock size={16} />
                                                    <span className="text-xs font-bold uppercase">Work In Progress</span>
                                                </div>
                                                <p className="text-xs text-amber-700">Assigned crew: <span className="font-bold underline">{workers.find(w => w._id === selectedIssue.assignedTo)?.name}</span></p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Upload Resolution Photo Evidence</p>
                                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                                    <input
                                                        type="file"
                                                        id="after-upload"
                                                        onChange={(e) => setAfterImage(e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="after-upload"
                                                        className="w-full sm:flex-1 border-2 border-dashed border-slate-300 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition-all group"
                                                    >
                                                        <Upload size={22} className="text-slate-400 group-hover:text-orange-600 mb-1" />
                                                        <span className="text-xs text-slate-600 font-bold uppercase">{afterImage ? afterImage.name : 'Choose Resolution Photo'}</span>
                                                    </label>
                                                    <button
                                                        onClick={() => handleResolve(selectedIssue._id)}
                                                        disabled={!afterImage || uploading}
                                                        className="w-full sm:w-auto px-6 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/25 cursor-pointer"
                                                    >
                                                        {uploading ? 'Processing...' : 'Complete & Close Ticket'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                                            <CheckCircle2 size={40} className="text-emerald-600 mx-auto mb-2" />
                                            <h4 className="text-lg font-bold text-emerald-800">Issue Successfully Resolved</h4>
                                            <p className="text-xs text-emerald-700 mt-1">Verified by AI Quality Control Engine &bull; {selectedIssue.governmentRemarks || 'Resolution confirmed.'}</p>
                                            {selectedIssue.resolutionPhotoUrl && (
                                                <div className="mt-4 max-w-sm mx-auto">
                                                    <img src={imgUrl(selectedIssue.resolutionPhotoUrl)} alt="Resolved" className="w-full h-40 object-cover rounded-xl border border-emerald-200" />
                                                    <p className="text-[10px] text-emerald-600 font-mono mt-1">Resolution Evidence</p>
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
                            <p className="text-xs text-slate-500 mt-1">Assign maintenance squads and review AI work plans</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
