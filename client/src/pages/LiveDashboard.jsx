import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import {
    Activity, Zap, Droplets, Car, ShieldAlert, Wifi,
    Trash2, Globe, AlertTriangle, TrendingUp, Info,
    Play, Square, ChevronRight, ChevronLeft, Map as MapIcon,
    Flame, Wind, CloudRain, Zap as PowerIcon, Sparkles, RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import {
    AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import 'leaflet/dist/leaflet.css';

// Reusable Stat Component
const ResourceStat = ({ icon: Icon, label, value, color, detail }) => (
    <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
        <div className={`p-2 rounded-xl border ${color.bg} ${color.text}`}>
            <Icon size={16} />
        </div>
        <div className="min-w-0">
            <div className="flex items-baseline gap-2">
                <span className="text-base font-extrabold text-[#0F172A] font-mono leading-none">{Math.round(value)}%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            </div>
            <div className="h-1.5 w-24 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className={`h-full ${color.bar} transition-all duration-1000`} style={{ width: `${value}%` }} />
            </div>
        </div>
    </div>
);

export default function LiveDashboard() {
    const { socket } = useSocket();
    const [wards, setWards] = useState([]);
    const [cityHealth, setCityHealth] = useState({ score: 100, timestamp: new Date(), activeDisaster: null });
    const [historicalData, setHistoricalData] = useState([]);
    const [selectedWard, setSelectedWard] = useState(null);
    const [loading, setLoading] = useState(true);

    // Replay state
    const [isReplaying, setIsReplaying] = useState(false);
    const [replayFrames, setReplayFrames] = useState([]);
    const [replayIndex, setReplayIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/wards');
                setWards(res.data);
                if (res.data.length > 0) setSelectedWard(res.data[0]);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        if (socket) {
            socket.on('ward_updates', (updatedWards) => {
                if (!isReplaying) {
                    setWards(updatedWards);
                    if (selectedWard) {
                        const current = updatedWards.find(w => w._id === selectedWard._id);
                        if (current) setSelectedWard(current);
                    }
                    const newPoint = {
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                        avgHealth: updatedWards.reduce((acc, w) => acc + w.currentHealthIndex, 0) / updatedWards.length
                    };
                    setHistoricalData(prev => [...prev.slice(-20), newPoint]);
                }
            });

            socket.on('city_health_update', (data) => {
                if (!isReplaying) setCityHealth(data);
            });
        }

        return () => {
            if (socket) {
                socket.off('ward_updates');
                socket.off('city_health_update');
            }
        };
    }, [socket, selectedWard, isReplaying]);

    const triggerSimulationDisaster = async (type) => {
        try {
            await api.post('/sim/disaster', { type, severity: 'High' });
        } catch (err) {
            alert('Simulation control failed');
        }
    };

    const startReplay = async () => {
        try {
            setIsReplaying(true);
            const end = new Date();
            const start = new Date(end.getTime() - 15 * 60000);
            const res = await api.get(`/sim/replay?start=${start.toISOString()}&end=${end.toISOString()}`);

            const grouped = res.data.reduce((acc, r) => {
                const time = new Date(r.timestamp).getTime();
                if (!acc[time]) acc[time] = [];
                acc[time].push(r);
                return acc;
            }, {});

            setReplayFrames(Object.values(grouped));
            setReplayIndex(0);
        } catch (err) {
            alert('Replay failed to load');
            setIsReplaying(false);
        }
    };

    useEffect(() => {
        let timer;
        if (isReplaying && replayIndex < replayFrames.length) {
            timer = setTimeout(() => {
                setReplayIndex(prev => prev + 1);
            }, 500);
        } else if (replayIndex >= replayFrames.length) {
            setIsReplaying(false);
        }
        return () => clearTimeout(timer);
    }, [isReplaying, replayIndex, replayFrames]);

    const getHealthColor = (score) => {
        if (score > 80) return { dot: '#10b981', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500', label: 'OPTIMAL' };
        if (score > 60) return { dot: '#f59e0b', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500', label: 'WARNING' };
        if (score > 40) return { dot: '#ef4444', bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', bar: 'bg-rose-500', label: 'CRITICAL' };
        return { dot: '#7f1d1d', bg: 'bg-red-100 border-red-300', text: 'text-red-950', bar: 'bg-red-800', label: 'OVERLOAD' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-mono text-xs text-slate-400 animate-pulse">
                BOOTING SMART CITY DIGITAL TWIN ENGINE...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden font-sans">

            {/* City Status Bar */}
            <div className="bg-white border-b border-slate-200/90 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 shadow-sm">
                <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/25">
                            <ShieldAlert size={16} />
                        </div>
                        <div>
                            <h1 className="text-sm font-extrabold text-[#0F172A] tracking-tight">Kavach-City AI <span className="text-orange-600 font-mono">v2.1</span></h1>
                            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Smart Twin Telemetry</p>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                    <div className="flex items-center gap-3">
                        <div className="text-left sm:text-center">
                            <p className="text-[9px] font-bold uppercase text-slate-400">City Health Index</p>
                            <p className={`text-lg font-extrabold font-mono ${getHealthColor(cityHealth.score).text}`}>{cityHealth.score}%</p>
                        </div>
                        <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${getHealthColor(cityHealth.score).bar} transition-all duration-1000`} style={{ width: `${cityHealth.score}%` }} />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${getHealthColor(cityHealth.score).text} ${getHealthColor(cityHealth.score).bg}`}>
                            {getHealthColor(cityHealth.score).label}
                        </span>
                    </div>

                    {cityHealth.activeDisaster && (
                        <div className="bg-rose-50 border border-rose-300 px-3 py-1 rounded-full flex items-center gap-2 animate-bounce">
                            <AlertTriangle size={13} className="text-rose-600" />
                            <span className="text-[10px] font-bold text-rose-700 uppercase">ACTIVE DISASTER: {cityHealth.activeDisaster.type}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => triggerSimulationDisaster('None')}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
                    >
                        Reset Simulation
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-full md:w-80 bg-white border-r border-slate-200/90 flex flex-col z-10 overflow-y-auto">
                    {/* Disaster Simulation */}
                    <div className="p-4 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Simulation Scenarios</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => triggerSimulationDisaster('Power Outage')}
                                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50/50 group transition-all cursor-pointer text-left"
                            >
                                <PowerIcon size={14} className="text-slate-400 group-hover:text-orange-600" />
                                <span className="text-[11px] font-bold text-slate-700">Power Outage</span>
                            </button>
                            <button
                                onClick={() => triggerSimulationDisaster('Flood')}
                                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 group transition-all cursor-pointer text-left"
                            >
                                <CloudRain size={14} className="text-slate-400 group-hover:text-blue-600" />
                                <span className="text-[11px] font-bold text-slate-700">Flooding</span>
                            </button>
                            <button
                                onClick={() => triggerSimulationDisaster('Traffic Jam')}
                                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/50 group transition-all cursor-pointer text-left"
                            >
                                <Car size={14} className="text-slate-400 group-hover:text-amber-600" />
                                <span className="text-[11px] font-bold text-slate-700">Traffic Jam</span>
                            </button>
                            <button
                                onClick={() => triggerSimulationDisaster('None')}
                                className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 group transition-all cursor-pointer text-left"
                            >
                                <Play size={14} className="text-slate-400 group-hover:text-emerald-600" />
                                <span className="text-[11px] font-bold text-slate-700">Normal Ops</span>
                            </button>
                        </div>
                    </div>

                    {/* Historical Replay */}
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Historical Replay</p>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between bg-white border border-slate-200 p-2.5 rounded-xl">
                                <span className="text-xs font-semibold text-slate-600">Telemetry Stream</span>
                                <div>
                                    {!isReplaying ? (
                                        <button onClick={startReplay} className="px-3 py-1 bg-[#ea580c] hover:bg-[#c2410c] text-white rounded-lg text-xs font-bold cursor-pointer">START</button>
                                    ) : (
                                        <button onClick={() => setIsReplaying(false)} className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"><Square size={10} /> STOP</button>
                                    )}
                                </div>
                            </div>
                            {isReplaying && (
                                <div className="space-y-1">
                                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${(replayIndex / replayFrames.length) * 100}%` }} />
                                    </div>
                                    <p className="text-[10px] text-center text-orange-600 font-mono font-bold animate-pulse">Frame {replayIndex} / {replayFrames.length}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ward Selection List */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-3.5 bg-white sticky top-0 border-b border-slate-100 z-10 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">City Wards ({wards.length})</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {wards.map(ward => {
                                const isSelected = selectedWard?._id === ward._id;
                                return (
                                    <div
                                        key={ward._id}
                                        onClick={() => setSelectedWard(ward)}
                                        className={`p-3.5 cursor-pointer transition-all border-l-4 ${
                                            isSelected
                                                ? 'bg-orange-50/70 border-orange-500'
                                                : 'hover:bg-slate-50 border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-xs font-bold text-[#0F172A] uppercase">{ward.name}</span>
                                            <span className={`text-[10px] font-bold font-mono ${getHealthColor(ward.currentHealthIndex).text}`}>
                                                {Math.round(ward.currentHealthIndex)}%
                                            </span>
                                        </div>
                                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                            <div className={`h-full ${getHealthColor(ward.currentHealthIndex).bar}`} style={{ width: `${ward.currentHealthIndex}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </aside>

                {/* Main Viewport */}
                <main className="flex-1 flex flex-col relative">

                    {/* Top Panel - Selected Ward Details */}
                    {selectedWard && (
                        <div className="bg-white border-b border-slate-200/90 p-5 sm:p-6 z-10 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 border border-orange-200 text-orange-600 rounded-xl flex items-center justify-center">
                                        <MapIcon size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="px-2 py-0.5 bg-[#0F172A] text-white text-[9px] font-bold font-mono rounded-full uppercase">{selectedWard.wardId}</span>
                                            <span className="text-xs font-bold text-orange-600 uppercase">{selectedWard.zone} Zone</span>
                                        </div>
                                        <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">{selectedWard.name}</h2>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-xs">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400">Population</p>
                                        <p className="text-base font-extrabold font-mono text-slate-900">{selectedWard.population.toLocaleString()}</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200" />
                                    <div>
                                        <p className="text-[10px] font-bold uppercase text-slate-400">Ward Status</p>
                                        <p className={`text-base font-extrabold font-mono ${getHealthColor(selectedWard.currentHealthIndex).text}`}>{getHealthColor(selectedWard.currentHealthIndex).label}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
                                <ResourceStat icon={PowerIcon} label="POWER" value={selectedWard.resources.power.utilization} color={{ bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', bar: 'bg-amber-500' }} />
                                <ResourceStat icon={Droplets} label="WATER" value={selectedWard.resources.water.utilization} color={{ bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500' }} />
                                <ResourceStat icon={Car} label="TRAFFIC" value={selectedWard.resources.traffic.utilization} color={{ bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', bar: 'bg-emerald-500' }} />
                                <ResourceStat icon={Activity} label="SEWAGE" value={selectedWard.resources.sewage.utilization} color={{ bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', bar: 'bg-indigo-500' }} />
                                <ResourceStat icon={Trash2} label="WASTE" value={selectedWard.resources.waste.utilization} color={{ bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', bar: 'bg-orange-500' }} />
                                <ResourceStat icon={Wifi} label="INTERNET" value={selectedWard.resources.internet.utilization} color={{ bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500' }} />
                            </div>
                        </div>
                    )}

                    {/* Map & Visualization Viewport */}
                    <div className="flex-1 relative flex flex-col bg-slate-100">
                        <div className="absolute inset-0 z-0">
                            <MapContainer
                                center={[12.9716, 77.5946]}
                                zoom={12}
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                            >
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                    attribution='&copy; CARTO'
                                />
                                {wards.map((ward) => (
                                    <CircleMarker
                                        key={ward._id}
                                        center={ward.location.coordinates.slice().reverse()}
                                        radius={14 + (100 - ward.currentHealthIndex) / 8}
                                        pathOptions={{
                                            fillColor: getHealthColor(ward.currentHealthIndex).dot,
                                            color: 'white',
                                            weight: 3,
                                            fillOpacity: 0.85
                                        }}
                                        eventHandlers={{
                                            click: () => setSelectedWard(ward)
                                        }}
                                    >
                                        <Popup>
                                            <div className="p-1 font-sans">
                                                <p className="font-bold text-xs border-b border-slate-200 pb-1 mb-1">{ward.name}</p>
                                                <p className="text-[11px] font-mono text-slate-700">Health: {Math.round(ward.currentHealthIndex)}%</p>
                                                <p className="text-[11px] font-mono text-slate-700">Traffic: {Math.round(ward.resources.traffic.utilization)}%</p>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                ))}
                            </MapContainer>
                        </div>

                        {/* Bottom Panel - Trend Analysis Overlay */}
                        <div className="absolute bottom-5 left-5 right-5 h-44 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-4 flex gap-6 z-10 transition-all hover:h-56">
                            <div className="w-1/3 flex flex-col">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <TrendingUp size={14} className="text-orange-600" />
                                    <span className="text-xs font-bold uppercase text-slate-800">Telemetry Trends</span>
                                </div>
                                <div className="flex-1 bg-slate-50 rounded-xl p-2 relative overflow-hidden">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={historicalData}>
                                            <defs>
                                                <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="avgHealth" stroke="#ea580c" strokeWidth={2} fillOpacity={1} fill="url(#colorHealth)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Zap size={14} className="text-amber-500" />
                                    <span className="text-xs font-bold uppercase text-slate-800">Sector Predictive Demand (4H Horizon)</span>
                                </div>
                                <div className="grid grid-cols-2 h-full gap-3 pb-6">
                                    {['power', 'traffic'].map(res => (
                                        <div key={res} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                                            <span className="text-[10px] font-bold uppercase text-slate-500">{res} Forecast</span>
                                            <div className="text-base font-extrabold font-mono text-slate-900">
                                                {Math.round((selectedWard?.resources[res].utilization || 0) + (Math.random() * 8 - 4))}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
