import React, { lazy } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SuspenseLoader from '../components/SuspenseLoader';

// Lazy load feature components
const ProfileSummary = lazy(() => import('../features/profile/components/ProfileSummary'));
const UserIssuesList = lazy(() => import('../features/profile/components/UserIssuesList'));

export default function CitizenProfile() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-1 px-3 rounded-md hover:bg-gray-50 mono text-xs uppercase tracking-tighter">
                        <ArrowLeft size={14} />
                        Return to Dash
                    </Link>
                    <h1 className="text-sm font-bold text-gray-900 mono uppercase tracking-widest">Citizen_Profile_V1</h1>
                    <div className="w-24"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Summary Section */}
                    <div className="lg:col-span-1">
                        <SuspenseLoader>
                            <ProfileSummary />
                        </SuspenseLoader>
                    </div>

                    {/* Reported Issues Section */}
                    <div className="lg:col-span-2">
                        <SuspenseLoader>
                            <UserIssuesList />
                        </SuspenseLoader>
                    </div>
                </div>
            </div>
        </div>
    );
}
