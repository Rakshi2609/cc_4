import React, { lazy } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import SuspenseLoader from '../components/SuspenseLoader';

const ProfileSummary = lazy(() => import('../features/profile/components/ProfileSummary'));
const UserIssuesList = lazy(() => import('../features/profile/components/UserIssuesList'));

export default function CitizenProfile() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-slate-200/90 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft size={15} />
                        <span>Return to Dashboard</span>
                    </Link>
                    <h1 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                        CITIZEN PROFILE PORTAL
                    </h1>
                    <div className="w-20" />
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Profile Summary Section */}
                    <div className="lg:col-span-4">
                        <SuspenseLoader>
                            <ProfileSummary />
                        </SuspenseLoader>
                    </div>

                    {/* Reported Issues Section */}
                    <div className="lg:col-span-8">
                        <SuspenseLoader>
                            <UserIssuesList />
                        </SuspenseLoader>
                    </div>
                </div>
            </div>
        </div>
    );
}
