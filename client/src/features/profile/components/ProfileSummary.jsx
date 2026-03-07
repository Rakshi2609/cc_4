import React, { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Phone, MapPin, Edit2, LogOut } from 'lucide-react';
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
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name || user?.name}</h2>
                <p className="text-gray-600 text-sm mt-1">Citizen Account</p>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                    <Mail size={18} className="text-blue-600" />
                    <span className="text-sm">{profile?.email || user?.email}</span>
                </div>
                {profile?.phone && (
                    <div className="flex items-center gap-3 text-gray-700">
                        <Phone size={18} className="text-blue-600" />
                        <span className="text-sm">{profile.phone}</span>
                    </div>
                )}
                {profile?.location && (
                    <div className="flex items-center gap-3 text-gray-700">
                        <MapPin size={18} className="text-blue-600" />
                        <span className="text-sm">{profile.location}</span>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{issues?.length || 0}</div>
                    <div className="text-sm text-gray-600">Issues Reported</div>
                </div>
            </div>

            <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Edit2 size={18} />
                    Edit Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileSummary;
