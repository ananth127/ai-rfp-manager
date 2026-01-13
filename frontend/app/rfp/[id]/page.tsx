'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    CheckCircleIcon,
    EnvelopeIcon,
    ArrowPathIcon,
    ArrowLeftIcon,
    CurrencyDollarIcon,
    CalendarIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ChartBarIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { IRFP } from '@/models/RFP';
import { IVendor } from '@/models/Vendor';
import { IProposal } from '@/models/Proposal';

type TabType = 'overview' | 'vendors' | 'proposals';

export default function RFPDetails({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { id } = params;
    const [rfp, setRfp] = useState<IRFP | null>(null);
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
    const [sending, setSending] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [comparing, setComparing] = useState(false);
    const [comparison, setComparison] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [rfpRes, vendorRes] = await Promise.all([
                api.get(`/rfps/${id}`),
                api.get('/vendors')
            ]);
            setRfp(rfpRes.data);
            setVendors(vendorRes.data);
            loadProposals();
        } catch (err) {
            console.error(err);
        }
    };

    const loadProposals = async () => {
        try {
            const { data } = await api.get(`/proposals?rfpId=${id}`);
            setProposals(data);
        } catch (err) {
            console.error("Failed to load proposals", err);
        }
    }

    const handleRefreshInbox = async () => {
        setRefreshing(true);
        try {
            await api.post('/proposals/check-inbox', { rfpId: id });
            await loadProposals();
        } catch (err) {
            alert("Failed to refresh inbox");
        } finally {
            setRefreshing(false);
        }
    };

    const toggleVendor = (vendorId: string) => {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(v => v !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSend = async () => {
        if (selectedVendors.length === 0) {
            alert('Please select at least one vendor');
            return;
        }
        setSending(true);
        try {
            await api.post(`/rfps/${id}/send`, { vendorIds: selectedVendors });
            alert('RFP sent successfully!');
            setSelectedVendors([]);
            loadData();
        } catch (err) {
            alert('Error sending RFP.');
        } finally {
            setSending(false);
        }
    };

    const handleCompare = async () => {
        setComparing(true);
        try {
            const { data } = await api.get(`/rfps/${id}/compare`);
            setComparison(data);
        } catch (err) {
            alert('Failed to generate comparison. Ensure you have proposals.');
        } finally {
            setComparing(false);
        }
    };

    if (!rfp) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading RFP details...</p>
            </div>
        </div>
    );

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800 border-gray-300',
        sent: 'bg-blue-100 text-blue-800 border-blue-300',
        closed: 'bg-green-100 text-green-800 border-green-300'
    };

    const tabs = [
        { id: 'overview' as TabType, name: 'Overview', icon: DocumentTextIcon },
        { id: 'vendors' as TabType, name: 'Vendors', icon: UserGroupIcon, badge: rfp.sentTo?.length || 0 },
        { id: 'proposals' as TabType, name: 'Proposals', icon: ChartBarIcon, badge: proposals.length },
    ];

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 pb-8 space-y-3 sm:space-y-4 animate-fade-in">
            {/* Back Button */}
            <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm hover:shadow transition-all"
            >
                <ArrowLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Back</span>
            </button>

            {/* Hero Header - Compact */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl overflow-hidden shadow-xl">
                <div className="p-3 sm:p-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg sm:text-2xl font-bold text-white mb-1 truncate">{rfp.title}</h1>
                            <p className="text-blue-100 text-xs sm:text-sm">
                                Created {new Date(rfp.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 ${statusColors[rfp.status as keyof typeof statusColors]} shadow-md flex-shrink-0`}>
                            {rfp.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Quick Stats - Compact Grid */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <div className="bg-white/10 backdrop-blur rounded-lg p-2 border border-white/20">
                            <CurrencyDollarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/80 mb-0.5" />
                            <p className="text-xs text-white/70">Budget</p>
                            <p className="font-bold text-xs sm:text-sm text-white truncate">
                                {rfp.structuredData?.currency || '$'} {rfp.structuredData?.budget?.toLocaleString() || 'N/A'}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-2 border border-white/20">
                            <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/80 mb-0.5" />
                            <p className="text-xs text-white/70">Deadline</p>
                            <p className="font-bold text-xs sm:text-sm text-white truncate">
                                {rfp.structuredData?.deadline
                                    ? new Date(rfp.structuredData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : 'N/A'}
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-lg p-2 border border-white/20">
                            <DocumentTextIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/80 mb-0.5" />
                            <p className="text-xs text-white/70">Items</p>
                            <p className="font-bold text-xs sm:text-sm text-white">{rfp.structuredData?.items?.length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation - Inside Header */}
                <div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
                    <div className="flex overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${isActive
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-white/90 hover:bg-white/20'
                                        }`}
                                >
                                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="hidden sm:inline">{tab.name}</span>
                                    {tab.badge !== undefined && tab.badge > 0 && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-indigo-600 text-white' : 'bg-white/30 text-white'
                                            }`}>
                                            {tab.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content - White Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-5">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-3 sm:space-y-4">
                        {/* Original Request */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border-2 border-blue-200">
                            <p className="text-xs font-bold text-blue-900 mb-1.5 uppercase">Original Request</p>
                            <p className="text-xs sm:text-sm text-blue-800 italic leading-relaxed">"{rfp.originalRequest}"</p>
                        </div>

                        {/* Items */}
                        {rfp.structuredData?.items && rfp.structuredData.items.length > 0 && (
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Items ({rfp.structuredData.items.length})</h3>
                                <div className="space-y-2">
                                    {rfp.structuredData.items.map((item: any, idx: number) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-2.5 hover:shadow-md transition-shadow bg-white">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-xs sm:text-sm text-gray-900">{item.name}</p>
                                                    {item.specs && <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{item.specs}</p>}
                                                </div>
                                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold whitespace-nowrap flex-shrink-0">
                                                    ×{item.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Requirements */}
                        {rfp.structuredData?.requirements && rfp.structuredData.requirements.length > 0 && (
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">Requirements ({rfp.structuredData.requirements.length})</h3>
                                <div className="space-y-1.5">
                                    {rfp.structuredData.requirements.map((req: string, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-200">
                                            <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="flex-1">{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Vendors Tab */}
                {activeTab === 'vendors' && (
                    <div className="space-y-3">
                        {rfp.status !== 'closed' ? (
                            <>
                                <div className="mb-3">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Select Vendors</h3>
                                    <p className="text-xs text-gray-600">Tap to select vendors to send this RFP</p>
                                </div>

                                <div className="space-y-2">
                                    {vendors.map(v => {
                                        const isSent = rfp.sentTo?.some(s => String(s) === String(v._id) || String((s as any)._id) === String(v._id));
                                        const isSelected = selectedVendors.includes(String(v._id));

                                        return (
                                            <button
                                                key={String(v._id)}
                                                onClick={!isSent ? () => toggleVendor(String(v._id)) : undefined}
                                                className={`w-full text-left p-2.5 sm:p-3 border-2 rounded-lg transition-all ${isSent
                                                    ? 'bg-green-50 border-green-300 cursor-not-allowed opacity-75'
                                                    : isSelected
                                                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm active:scale-98'
                                                    }`}
                                                disabled={isSent}
                                            >
                                                <div className="flex justify-between items-center gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">{v.name}</h4>
                                                        <p className="text-xs text-gray-600 truncate">{v.email}</p>
                                                        {v.contactPerson && (
                                                            <p className="text-xs text-gray-500 truncate">{v.contactPerson}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        {isSent ? (
                                                            <div className="flex items-center gap-1 px-2 py-1 bg-green-600 rounded-md">
                                                                <CheckCircleIcon className="h-3.5 w-3.5 text-white" />
                                                                <span className="text-xs font-bold text-white">Sent</span>
                                                            </div>
                                                        ) : isSelected ? (
                                                            <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                                                                <CheckCircleIcon className="h-4 w-4 text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                                                        )}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedVendors.length > 0 && (
                                    <div className="sticky bottom-0 pt-3 bg-white">
                                        <button
                                            onClick={handleSend}
                                            disabled={sending}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <EnvelopeIcon className="h-4 w-4" />
                                            {sending ? 'Sending...' : `Send to ${selectedVendors.length} Vendor${selectedVendors.length > 1 ? 's' : ''}`}
                                        </button>
                                    </div>
                                )}

                                {vendors.length === 0 && (
                                    <div className="text-center py-8">
                                        <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600 font-medium text-sm">No vendors available</p>
                                        <p className="text-xs text-gray-500 mt-1">Add vendors first to send RFPs</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium">RFP Closed</p>
                                <p className="text-xs text-gray-500 mt-1">Cannot invite more vendors</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Proposals Tab */}
                {activeTab === 'proposals' && (
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold text-gray-900">Proposals ({proposals.length})</h3>
                                <p className="text-xs text-gray-600">AI-extracted from vendor emails</p>
                            </div>
                            <button
                                onClick={handleRefreshInbox}
                                disabled={refreshing}
                                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all"
                            >
                                <ArrowPathIcon className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                                {refreshing ? 'Checking...' : 'Refresh'}
                            </button>
                        </div>

                        {proposals.length >= 2 && !comparison && (
                            <button
                                onClick={handleCompare}
                                disabled={comparing}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-xs sm:text-sm"
                            >
                                {comparing ? 'Analyzing...' : '🤖 AI Compare & Recommend'}
                            </button>
                        )}

                        {/* AI Comparison */}
                        {comparison && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-3">
                                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-1.5 text-sm">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    AI Recommendation
                                </h4>
                                <div className="text-xs sm:text-sm text-green-800 leading-relaxed whitespace-pre-wrap">
                                    {comparison}
                                </div>
                            </div>
                        )}

                        {/* Proposals List */}
                        {proposals.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 font-medium text-sm">No proposals yet</p>
                                <p className="text-xs text-gray-500 mt-1">Vendors submit via email</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {proposals.map((p: any) => {
                                    const vendorName = p.vendor?.name || 'Unknown Vendor';
                                    const vendorEmail = p.vendor?.email || '';
                                    const totalPrice = p.parsedData?.totalPrice;
                                    const deliveryTimeline = p.parsedData?.deliveryTimeline;
                                    const summary = p.parsedData?.summary;
                                    const lineItems = p.parsedData?.lineItems || [];
                                    const warranty = p.parsedData?.warranty;

                                    return (
                                        <div key={String(p._id)} className="border-2 border-gray-200 rounded-lg p-2.5 sm:p-3 hover:shadow-md transition-all bg-white">
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-sm text-gray-900">{vendorName}</h4>
                                                    {vendorEmail && <p className="text-xs text-gray-600 truncate">{vendorEmail}</p>}
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Received {new Date(p.receivedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {totalPrice && (
                                                    <span className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-bold whitespace-nowrap flex-shrink-0">
                                                        ${totalPrice.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Proposal Details */}
                                            <div className="space-y-2 mt-3">
                                                {deliveryTimeline && (
                                                    <div className="flex items-start gap-2 text-xs">
                                                        <CalendarIcon className="h-3.5 w-3.5 text-gray-500 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-medium text-gray-700">Delivery:</span>
                                                            <span className="text-gray-600 ml-1">{deliveryTimeline}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {warranty && (
                                                    <div className="flex items-start gap-2 text-xs">
                                                        <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <span className="font-medium text-gray-700">Warranty:</span>
                                                            <span className="text-gray-600 ml-1">{warranty}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {summary && (
                                                    <p className="text-xs text-gray-700 bg-blue-50 p-2 rounded border border-blue-200 italic">
                                                        "{summary}"
                                                    </p>
                                                )}

                                                {/* Line Items */}
                                                {lineItems.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                        <p className="text-xs font-bold text-gray-700 mb-1">Items ({lineItems.length})</p>
                                                        <div className="space-y-1">
                                                            {lineItems.slice(0, 3).map((item: any, idx: number) => (
                                                                <div key={idx} className="flex justify-between items-start gap-2 text-xs bg-gray-50 p-1.5 rounded">
                                                                    <span className="text-gray-700 flex-1">{item.name}</span>
                                                                    {item.price && (
                                                                        <span className="font-medium text-gray-900 flex-shrink-0">
                                                                            ${item.price.toLocaleString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {lineItems.length > 3 && (
                                                                <p className="text-xs text-gray-500 italic">
                                                                    +{lineItems.length - 3} more items
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
