import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
    Wallet, TrendingDown, TrendingUp, AlertCircle,
    ArrowLeft, RefreshCw, Layers, PieChart,
    ArrowRight, ShieldAlert, CheckCircle2, DollarSign,
    Save, Edit3, X, Zap, Droplets, Car, Activity, Trash2, Wifi, Sparkles
} from 'lucide-react';

const SECTOR_ICONS = {
    power: Zap,
    water: Droplets,
    traffic: Car,
    sewage: Activity,
    waste: Trash2,
    internet: Wifi
};

export default function GovBudget() {
    const navigate = useNavigate();
    const [wards, setWards] = useState([]);
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [totalCityBudget, setTotalCityBudget] = useState(1500000);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [wardsRes, aiRes] = await Promise.all([
                api.get('/wards'),
                api.get('/analytics/ai-recommendations')
            ]);
            setWards(wardsRes.data);
            setAiRecommendations(aiRes.data);

            const initialEdit = {};
            wardsRes.data.forEach(w => {
                initialEdit[w._id] = { ...w.resources };
            });
            setEditData(initialEdit);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleBudgetChange = (wardId, sector, value) => {
        setEditData(prev => ({
            ...prev,
            [wardId]: {
                ...prev[wardId],
                [sector]: { ...prev[wardId][sector], budget: parseInt(value) || 0 }
            }
        }));
    };

    const calculateAllocated = () => {
        return Object.values(editData).reduce((total, wardRes) => {
            return total + Object.values(wardRes).reduce((wTotal, s) => wTotal + (s.budget || 0), 0);
        }, 0);
    };

    const handleSaveAll = async () => {
        try {
            setLoading(true);
            await Promise.all(
                Object.entries(editData).map(([id, resources]) =>
                    api.patch(`/wards/${id}`, { resources })
                )
            );
            setIsEditing(false);
            fetchData();
        } catch (err) {
            alert('Failed to save budgets');
        } finally {
            setLoading(false);
        }
    };

    if (loading && wards.length === 0) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-mono text-xs text-slate-400 animate-pulse">
                SYNCING FISCAL ALLOCATION TELEMETRY...
            </div>
        );
    }

    const currentAllocated = calculateAllocated();
    const remaining = totalCityBudget - currentAllocated;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200/90 px-6 py-4 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/gov-dashboard')}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div className="w-9 h-9 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                            <Wallet size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Fiscal Command Center</h1>
                            <p className="text-xs text-slate-500">Smart Resource Planning &amp; AI-Guided Ward Allocation</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                            >
                                <Edit3 size={14} />
                                <span>Enter Allocation Mode</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => { setIsEditing(false); fetchData(); }}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveAll}
                                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/25 cursor-pointer"
                                >
                                    <Save size={14} />
                                    <span>Commit Budgets</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Budget Summary Bar */}
                <div className={`bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm transition-all ${isEditing ? 'ring-2 ring-orange-500 shadow-lg' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Municipal Pool</p>
                            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#0F172A]">
                                ₹ {(totalCityBudget / 100000).toFixed(1)} Cr
                            </h2>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Allocated Funds</p>
                            <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-emerald-600">
                                ₹ {(currentAllocated / 100000).toFixed(2)} Cr
                            </h2>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Remaining Balance</p>
                            <h2 className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${remaining < 0 ? 'text-rose-600' : 'text-orange-600'}`}>
                                ₹ {(remaining / 100000).toFixed(2)} Cr
                            </h2>
                        </div>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${remaining < 0 ? 'bg-rose-500' : 'bg-[#ea580c]'}`}
                            style={{ width: `${Math.min(100, (currentAllocated / totalCityBudget) * 100)}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Wards List with Sector Budgets (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                        {wards.map((ward) => (
                            <div key={ward._id} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2.5 py-0.5 bg-[#0F172A] text-white text-[10px] font-bold font-mono rounded-full uppercase">{ward.wardId}</span>
                                        <h3 className="font-extrabold text-[#0F172A]">{ward.name}</h3>
                                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">{ward.zone}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold uppercase text-slate-400">Ward Allocated</p>
                                        <p className="font-bold text-slate-900 font-mono">₹ {(Object.values(editData[ward._id] || {}).reduce((a, b) => a + (b.budget || 0), 0) / 1000).toFixed(1)}k</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {Object.keys(ward.resources).map((sector) => {
                                        const Icon = SECTOR_ICONS[sector] || Activity;
                                        const budgetValue = editData[ward._id]?.[sector]?.budget || 0;
                                        const utilization = ward.resources[sector].utilization;

                                        return (
                                            <div key={sector} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-slate-600">
                                                        <Icon size={13} className="text-orange-600" />
                                                        <span className="text-[10px] font-bold uppercase">{sector}</span>
                                                    </div>
                                                </div>

                                                <div className="text-[10px] font-mono font-bold text-slate-500">
                                                    Load: <span className={utilization > 80 ? 'text-rose-600' : 'text-emerald-600'}>{Math.round(utilization)}%</span>
                                                </div>

                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={budgetValue}
                                                        onChange={(e) => handleBudgetChange(ward._id, sector, e.target.value)}
                                                        className="w-full px-2 py-1 bg-white border border-orange-300 rounded-lg font-mono text-xs font-bold text-orange-950 focus:border-orange-500 outline-none"
                                                    />
                                                ) : (
                                                    <div>
                                                        <p className="text-sm font-extrabold text-[#0F172A] font-mono">₹{(budgetValue / 1000).toFixed(0)}k</p>
                                                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                                                            <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, (budgetValue / 200000) * 100)}%` }} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Guidance Sidebar (1 col) */}
                    <div className="space-y-6">
                        <div className="bg-white border border-orange-200/90 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <Sparkles size={16} className="text-orange-600" />
                                <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0F172A]">Mistral Fiscal Advisory</h3>
                            </div>

                            <div className="space-y-3">
                                {aiRecommendations?.budgetAdvice?.recommendations?.map((rec, i) => (
                                    <div
                                        key={i}
                                        className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl cursor-pointer hover:border-orange-300 transition-colors"
                                        onClick={() => {
                                            if (isEditing) {
                                                const ward = wards.find(w => w.name === rec.ward);
                                                if (ward) handleBudgetChange(ward._id, rec.sector, (editData[ward._id][rec.sector].budget || 0) * 1.25);
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[9px] font-mono font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md uppercase">{rec.sector}</span>
                                            <span className="text-xs font-bold text-slate-800">{rec.ward}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed italic mt-1.5">"{rec.recommendation}"</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm text-xs text-slate-600 space-y-3">
                            <h4 className="font-bold text-[#0F172A] uppercase tracking-wider text-xs">Allocation Best Practices</h4>
                            <p className="leading-relaxed">Higher capital buffers allocated to power grids significantly lower transformer overheating rates during peak summer months.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
