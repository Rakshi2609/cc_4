import React, { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Phone, MapPin, Edit2, LogOut, Shield, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';

export const ProfileSummary = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const { data: profile } = useSuspenseQuery({
        queryKey: ['profile'],
        queryFn: profileApi.getProfile,
    });

    const { data: issues } = useSuspenseQuery({
        queryKey: ['user-issues'],
        queryFn: profileApi.getUserIssues,
    });

    const handleLogout = useCallback(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-[#ea580c] to-[#f97316] rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl font-black shadow-lg shadow-orange-500/25">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-extrabold text-[#0F172A]">{profile?.name || user?.name}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase mt-2">
                    <Shield size={11} />
                    <span>Verified Citizen</span>
                </div>
            </div>

            <div className="space-y-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                    <Mail size={15} className="text-orange-600 flex-shrink-0" />
                    <span className="truncate">{profile?.email || user?.email}</span>
                </div>
                {profile?.phone && (
                    <div className="flex items-center gap-2.5 text-slate-700">
                        <Phone size={15} className="text-orange-600 flex-shrink-0" />
                        <span>{profile.phone}</span>
                    </div>
                )}
                {profile?.location && (
                    <div className="flex items-center gap-2.5 text-slate-700">
                        <MapPin size={15} className="text-orange-600 flex-shrink-0" />
                        <span>{profile.location}</span>
                    </div>
                )}
            </div>

            <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 mb-6 text-center">
                <div className="text-3xl font-extrabold font-mono text-orange-600">{issues?.length || 0}</div>
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mt-0.5">Issues Submitted</div>
            </div>

            <div className="space-y-2.5">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileSummary;
