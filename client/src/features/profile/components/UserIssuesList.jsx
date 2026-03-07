import React from 'react';
import { Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profileApi';

export const UserIssuesList = () => {
    const { data: issues } = useSuspenseQuery({
        queryKey: ['user-issues'],
        queryFn: profileApi.getUserIssues,
    });

    if (!issues || issues.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Reported Issues</h3>
                <div className="text-center py-12">
                    <Award size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-600 mb-4">No issues reported yet</p>
                    <Link
                        to="/report"
                        className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Report First Issue
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Reported Issues</h3>
            <div className="space-y-4">
                {issues.map((issue) => (
                    <div key={issue._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h4 className="font-semibold text-gray-900">{issue.title}</h4>
                                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                issue.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {issue.status?.toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                            <span>{issue.category}</span>
                            <span>•</span>
                            <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserIssuesList;
