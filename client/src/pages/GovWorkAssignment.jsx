import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    Users, Target, ClipboardList, CheckCircle2,
    Clock, AlertCircle, ChevronRight, Upload,
    MapPin, User, ArrowRight, ShieldCheck,
    Briefcase, Activity
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

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
            alert('Resolution upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="p-10 mono text-xs animate-pulse">BOOTING WORK_COMMAND...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-sm flex items-center justify-center text-white">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black mono tracking-tighter uppercase">Work Assignment & Verification</h1>
                        <p className="text-[10px] mono text-gray-400 uppercase tracking-widest">Digital Infrastructure Maintenance</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <div className="text-right">
                        <p className="mono text-[10px] text-gray-400 uppercase">Unassigned</p>
                        <p className="text-xl font-black mono text-red-500">{issues.filter(i => !i.assignedTo).length}</p>
                    </div>
                    <div className="text-right">
                        <p className="mono text-[10px] text-gray-400 uppercase">In Progress</p>
                        <p className="text-xl font-black mono text-amber-500">{issues.filter(i => i.status === 'in-progress').length}</p>
                    </div>
                    <div className="text-right">
                        <p className="mono text-[10px] text-gray-400 uppercase">Resolved</p>
                        <p className="text-xl font-black mono text-green-600">{issues.filter(i => i.status === 'resolved').length}</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Issues List */}
                <div className="w-1/3 border-r border-gray-200 bg-white overflow-y-auto">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                        <span className="mono text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Tickets</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {issues.map(issue => (
                            <div
                                key={issue._id}
                                onClick={() => setSelectedIssue(issue)}
                                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedIssue?._id === issue._id ? 'bg-indigo-50 border-indigo-600' : 'hover:bg-gray-50 border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="text-sm font-bold text-gray-900 truncate flex-1 pr-2">{issue.title}</h3>
                                    <StatusBadge status={issue.status} />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-black mono uppercase rounded-sm">{issue.category}</span>
                                    <span className="mono text-[9px] text-gray-400 uppercase">{new Date(issue.createdAt).toLocaleDateString()}</span>
                                    {issue.assignedTo && (
                                        <span className="ml-auto text-[9px] mono text-indigo-600 font-bold uppercase flex items-center gap-1">
                                            <User size={10} /> {workers.find(w => w._id === issue.assignedTo)?.name || 'Assigned'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assignment & Details Panel */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {selectedIssue ? (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black mono uppercase rounded-sm">ISSUE #{selectedIssue._id.slice(-6).toUpperCase()}</span>
                                            {selectedIssue.aiVerified && (
                                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-black mono uppercase rounded-sm">
                                                    <ShieldCheck size={10} /> AI VERIFIED
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{selectedIssue.title}</h2>
                                        <p className="text-gray-500 text-sm mt-1">{selectedIssue.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-right mb-2">
                                            <p className="mono text-[10px] text-gray-400 uppercase">Severity Score</p>
                                            <p className="text-2xl font-black mono text-gray-900">{selectedIssue.severityScore || 0}%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8 pb-8 border-b border-gray-100">
                                    <div>
                                        <p className="mono text-[10px] text-gray-400 uppercase mb-2">Original Report</p>
                                        <img src={selectedIssue.imageUrl} alt="Before" className="w-full h-48 object-cover rounded-sm border border-gray-200" />
                                    </div>
                                    <div>
                                        <p className="mono text-[10px] text-gray-400 uppercase mb-2">AI Work Plan</p>
                                        <div className="bg-gray-50 rounded-sm p-4 h-48 border border-gray-100 overflow-y-auto">
                                            {selectedIssue.aiWorkPlan && selectedIssue.aiWorkPlan.length > 0 ? (
                                                <div className="space-y-3">
                                                    {selectedIssue.aiWorkPlan.map((step, i) => (
                                                        <div key={i} className="flex gap-3">
                                                            <span className="mono text-[10px] font-black text-indigo-600 mt-1">{i + 1}.</span>
                                                            <p className="text-xs text-gray-600 font-medium leading-relaxed">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">No AI work plan generated yet. Assign a worker to trigger AI analysis.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    {selectedIssue.status === 'pending' ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-indigo-600" />
                                                <span className="mono text-[12px] font-black text-gray-900 uppercase">Assign Maintenance Crew</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <select
                                                    value={selectedWorker}
                                                    onChange={(e) => setSelectedWorker(e.target.value)}
                                                    className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded-sm text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                >
                                                    <option value="">Select a worker...</option>
                                                    {workers.map(w => (
                                                        <option key={w._id} value={w._id}>{w.name} ({w.email})</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={handleAssign}
                                                    disabled={!selectedWorker}
                                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white mono text-xs font-black uppercase disabled:opacity-50 transition-all flex items-center gap-2"
                                                >
                                                    CONFIRM ASSIGNMENT <ArrowRight size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : selectedIssue.status === 'in-progress' ? (
                                        <div className="space-y-4">
                                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm">
                                                <div className="flex items-center gap-2 text-amber-700 mb-2">
                                                    <Clock size={16} />
                                                    <span className="mono text-[12px] font-black uppercase tracking-tight">Work In Progress</span>
                                                </div>
                                                <p className="text-xs text-amber-600">Assigned to: <span className="font-bold underline">{workers.find(w => w._id === selectedIssue.assignedTo)?.name}</span></p>
                                            </div>

                                            <div className="mt-6 pt-6 border-t border-gray-100">
                                                <p className="mono text-[10px] text-gray-400 uppercase mb-4">Upload Resolution Image (Manual Verification)</p>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="file"
                                                        id="after-upload"
                                                        onChange={(e) => setAfterImage(e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                    <label
                                                        htmlFor="after-upload"
                                                        className="flex-1 border-2 border-dashed border-gray-300 rounded-sm p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition-all group"
                                                    >
                                                        <Upload size={24} className="text-gray-400 group-hover:text-indigo-500 mb-2" />
                                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{afterImage ? afterImage.name : 'Choose After Photo'}</span>
                                                    </label>
                                                    <button
                                                        onClick={() => handleResolve(selectedIssue._id)}
                                                        disabled={!afterImage || uploading}
                                                        className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-black mono text-sm uppercase tracking-tighter disabled:opacity-50 transition-all shadow-lg"
                                                    >
                                                        {uploading ? 'UPLOADING...' : 'COMPLETE WORK'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 p-6 rounded-sm text-center">
                                            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-3" />
                                            <h4 className="text-xl font-black text-green-800 uppercase tracking-tighter">Issue Successfully Resolved</h4>
                                            <p className="text-sm text-green-600 mt-2">Verified by AI Quality Control Engine · {selectedIssue.governmentRemarks || 'Resolution confirmed.'}</p>
                                            {selectedIssue.resolutionPhotoUrl && (
                                                <div className="mt-4 max-w-sm mx-auto">
                                                    <img src={selectedIssue.resolutionPhotoUrl} alt="Resolved" className="w-full h-40 object-cover rounded-sm border border-green-200" />
                                                    <p className="text-[10px] text-green-500 mono uppercase mt-1">Resolution Evidence</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Target size={32} className="text-gray-300" />
                            </div>
                            <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest">Select a ticket to manage assignment</h3>
                            <p className="text-[10px] mono text-gray-300 mt-2">WORKFORCE COMMAND & CONTROL v1.0</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
