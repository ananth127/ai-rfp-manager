'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { SparklesIcon, ArrowRightIcon, CheckCircleIcon, LightBulbIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { IRFP } from '@/types';

export default function CreateRFP() {
    const [input, setInput] = useState('');
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState<IRFP['structuredData'] | null>(null);
    const [title, setTitle] = useState('');
    const router = useRouter();

    const handleParse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setParsing(true);
        try {
            const { data } = await api.post('/rfps/parse', { originalRequest: input });
            setParsedData(data);
            setTitle(`Procurement for ${data.items?.[0]?.name || 'Request'} ...`);
        } catch (err) {
            console.error(err);
            alert('Failed to parse (AI Service might be down or misconfigured)');
        } finally {
            setParsing(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await api.post('/rfps', {
                title,
                originalRequest: input,
                structuredData: parsedData
            });
            router.push('/');
        } catch (err) {
            alert('Failed to save RFP');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
            {/* Compact Mobile Header */}
            <div className="text-center mb-3 sm:mb-6">
                <h1 className="text-lg sm:text-3xl font-bold mb-0.5 sm:mb-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Create New RFP
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm px-2 sm:px-4">
                    Describe your needs in plain language. AI will structure it.
                </p>
            </div>

            {!parsedData ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
                    {/* Main Input - 2 columns */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleParse} className="glass-effect rounded-xl border border-white/20 shadow-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                                    <LightBulbIcon className="h-6 w-6" />
                                    What do you need?
                                </h2>
                            </div>
                            <div className="p-4">
                                <textarea
                                    rows={12}
                                    className="w-full rounded-xl border-2 border-gray-200 p-3 text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 text-sm resize-none transition-all bg-white"
                                    placeholder="Example: Need 50 MacBooks (M3, 32GB RAM, 1TB SSD) + 50 monitors (27-inch 4K). Budget: $200,000. Delivery: End of month."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <div className="mt-4 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="flex h-2 w-2">
                                            <span className="animate-ping absolute h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </div>
                                        AI Ready
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={parsing || !input}
                                        className="btn-gradient gradient-primary px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center gap-2 text-white text-sm"
                                    >
                                        {parsing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <SparklesIcon className="h-5 w-5" />
                                                Generate
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Side Info Cards - 1 column */}
                    <div className="space-y-3">
                        {/* Side Info Cards - More Compact */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-md">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                                    <LightBulbIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Quick Tip</h3>
                                    <p className="text-sm text-gray-700">Include budget, quantities, specs, and timeline for best results.</p>
                                </div>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="glass-effect border-2 border-indigo-200 rounded-2xl p-5 shadow-lg">
                            <h3 className="font-bold text-gray-900 mb-3">AI Will Extract:</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Budget & Currency</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Item Details & Quantities</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700">Deadlines & Requirements</span>
                                </li>
                            </ul>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5 shadow-lg">
                            <div className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">99%</div>
                                <div className="text-xs text-gray-600 font-semibold">Accuracy Rate</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Header Bar */}
                    <div className="flex justify-between items-center glass-effect rounded-2xl p-5 shadow-lg border border-white/20">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Review & Confirm</h2>
                            <p className="text-sm text-gray-600">AI structured your request</p>
                        </div>
                        <button
                            onClick={() => setParsedData(null)}
                            className="px-5 py-2 rounded-lg bg-white/50 hover:bg-white border border-gray-200 font-semibold text-gray-700 transition-all"
                        >
                            ← Edit
                        </button>
                    </div>

                    {/* Title */}
                    <div className="glass-effect rounded-2xl p-6 shadow-lg border border-white/20">
                        <label className="block text-sm font-bold text-gray-700 mb-2">RFP Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full rounded-lg border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 px-4 py-3 text-lg font-semibold transition-all bg-white"
                        />
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Budget */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                                    <CurrencyDollarIcon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900">Budget</h3>
                            </div>
                            <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {parsedData.currency} {parsedData.budget?.toLocaleString()}
                            </div>
                        </div>

                        {/* Deadline */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900">Deadline</h3>
                            </div>
                            <div className="text-lg font-bold text-gray-900">
                                {parsedData.deadline ? new Date(parsedData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                                    <CheckCircleIcon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900">Requirements</h3>
                            </div>
                            <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {parsedData.requirements?.length || 0}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="glass-effect rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h3 className="font-bold text-white text-lg">Items Requested</h3>
                        </div>
                        <div className="overflow-x-auto bg-white">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Qty</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Specs</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {parsedData.items?.map((item, i) => (
                                        <tr key={i} className="hover:bg-indigo-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-indigo-600 font-bold">{item.quantity}</td>
                                            <td className="px-6 py-4 text-gray-700 text-sm">{item.specs}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Requirements List */}
                    {parsedData.requirements && parsedData.requirements.length > 0 && (
                        <div className="glass-effect rounded-2xl p-6 shadow-lg border border-white/20">
                            <h3 className="font-bold text-gray-900 mb-4">Additional Requirements</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {parsedData.requirements.map((req, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircleIcon className="h-5 w-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="btn-gradient gradient-success px-8 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 text-white"
                        >
                            <CheckCircleIcon className="h-6 w-6" />
                            Create RFP
                            <ArrowRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
