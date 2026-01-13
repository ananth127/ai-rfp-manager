'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { DocumentTextIcon, CalendarIcon, CurrencyDollarIcon, SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';
import { IRFP } from '@/types';

const statusStyles: Record<string, string> = {
    draft: 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-slate-300',
    sent: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-300',
    closed: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-300',
};

export default function Dashboard() {
    const [rfps, setRfps] = useState<IRFP[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRFPs = async () => {
            try {
                const { data } = await api.get('/rfps');
                setRfps(data);
            } catch (error) {
                console.error("Failed to load RFPs", error);
            } finally {
                setLoading(false);
            }
        };
        loadRFPs();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 animate-fade-in-up">
            {/* Compact Mobile Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-lg sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                            Procurement Dashboard
                        </h1>
                        <p className="text-blue-100 text-xs sm:text-sm">
                            Intelligent RFP management powered by AI
                        </p>
                    </div>
                    <Link
                        href="/create"
                        className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-50 inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg text-xs sm:text-sm font-bold hover:shadow-xl transition-all border-2 border-white"
                    >
                        <SparklesIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Create New RFP
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shimmer h-40 sm:h-48 border-2 border-gray-200"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {rfps.map((rfp) => (
                        <Link key={rfp._id as unknown as string} href={`/rfp/${rfp._id}`} className="block group">
                            <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-indigo-400 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-0.5">
                                {/* Colored Top Bar */}
                                <div className={`h-1 sm:h-1.5 ${rfp.status === 'draft' ? 'bg-gradient-to-r from-slate-400 to-gray-500' : rfp.status === 'sent' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}></div>

                                <div className="p-2 sm:p-4">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-1.5 sm:mb-3">
                                        <span className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-bold shadow-sm ${statusStyles[rfp.status]}`}>
                                            {rfp.status.toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-0.5 sm:gap-1 text-gray-500">
                                            <ClockIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                            <span className="text-xs font-medium">
                                                {new Date(rfp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-sm sm:text-lg font-black text-gray-900 mb-1.5 sm:mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[1.75rem] sm:min-h-[2.75rem]">
                                        {rfp.title}
                                    </h3>

                                    {/* Info Cards - Smaller on Mobile */}
                                    <div className="space-y-1.5 sm:space-y-2">
                                        {rfp.structuredData?.budget && (
                                            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-md sm:rounded-lg border border-emerald-200">
                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-sm sm:rounded-md shadow-sm flex-shrink-0">
                                                    <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-emerald-700 font-semibold">Budget</p>
                                                    <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{rfp.structuredData.currency} {rfp.structuredData.budget.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {rfp.structuredData?.deadline && (
                                            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-md sm:rounded-lg border border-orange-200">
                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-orange-500 to-amber-600 rounded-sm sm:rounded-md shadow-sm flex-shrink-0">
                                                    <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-orange-700 font-semibold">Deadline</p>
                                                    <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{new Date(rfp.structuredData.deadline).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        {rfp.structuredData?.items?.length > 0 && (
                                            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md sm:rounded-lg border border-blue-200">
                                                <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm sm:rounded-md shadow-sm flex-shrink-0">
                                                    <DocumentTextIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs text-blue-700 font-semibold">Items</p>
                                                    <p className="font-bold text-xs sm:text-sm text-gray-900 truncate">{rfp.structuredData.items.length} Requested</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {rfps.length === 0 && (
                        <div className="col-span-full">
                            <div className="bg-white rounded-lg sm:rounded-xl border-2 border-dashed border-indigo-300 p-4 sm:p-8 text-center">
                                <div className="inline-flex p-2 sm:p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg sm:rounded-xl mb-2 sm:mb-3">
                                    <SparklesIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600" />
                                </div>
                                <p className="text-gray-900 text-base sm:text-lg font-bold mb-1">No active RFPs found.</p>
                                <p className="text-gray-600 text-xs sm:text-sm">Create your first RFP to get started with AI-powered procurement.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
