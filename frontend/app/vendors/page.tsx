'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Modal from '@/components/Modal';
import TagInput from '@/components/TagInput';
import { PlusIcon, UserGroupIcon, EnvelopeIcon, TagIcon, CheckBadgeIcon, PencilSquareIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { IVendor } from '@/models/Vendor';

export default function VendorList() {
    const [vendors, setVendors] = useState<IVendor[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<IVendor | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', contactPerson: '', tags: [] as string[] });

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            const { data } = await api.get('/vendors');
            setVendors(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/vendors', { ...formData });
            setShowAddModal(false);
            setFormData({ name: '', email: '', contactPerson: '', tags: [] });
            loadVendors();
        } catch (err) {
            alert('Error creating vendor');
        }
    };

    const openEditModal = (vendor: IVendor) => {
        setSelectedVendor(vendor);
        setFormData({
            name: vendor.name,
            email: vendor.email,
            contactPerson: vendor.contactPerson || '',
            tags: vendor.tags || []
        });
        setShowEditModal(true);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVendor) return;
        try {
            await api.put(`/vendors/${selectedVendor._id}`, { ...formData });
            setShowEditModal(false);
            setSelectedVendor(null);
            setFormData({ name: '', email: '', contactPerson: '', tags: [] });
            loadVendors();
        } catch (err) {
            alert('Error updating vendor');
        }
    };

    const openDeleteModal = (vendor: IVendor) => {
        setSelectedVendor(vendor);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedVendor) return;
        try {
            await api.delete(`/vendors/${selectedVendor._id}`);
            setShowDeleteModal(false);
            setSelectedVendor(null);
            loadVendors();
        } catch (err) {
            alert('Error deleting vendor');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 animate-fade-in-up">
            {/* Compact Mobile Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-lg sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">
                            Vendor Directory
                        </h1>
                        <p className="text-purple-100 text-xs sm:text-sm">
                            Manage and organize your procurement vendors
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full sm:w-auto bg-white text-purple-600 hover:bg-purple-50 inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg text-xs sm:text-sm font-bold hover:shadow-xl transition-all border-2 border-white"
                    >
                        <PlusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Add Vendor
                    </button>
                </div>
            </div>

            {/* Add Vendor Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Add New Vendor"
                icon={<UserGroupIcon className="h-6 w-6 text-white" />}
                maxWidth="2xl"
            >
                <form onSubmit={handleAdd} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Vendor Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Tech Solutions Inc."
                                required
                                className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all bg-white text-gray-900"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                            <input
                                type="email"
                                placeholder="vendor@example.com"
                                required
                                className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all bg-white text-gray-900"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all bg-white text-gray-900"
                                value={formData.contactPerson}
                                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                            <TagInput
                                tags={formData.tags}
                                onChange={(tags) => setFormData({ ...formData, tags })}
                                placeholder="Add a tag (e.g., hardware, software)"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-8 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <CheckBadgeIcon className="h-5 w-5" />
                            Save Vendor
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Vendor Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedVendor(null);
                    setFormData({ name: '', email: '', contactPerson: '', tags: [] });
                }}
                title="Edit Vendor"
                icon={<PencilSquareIcon className="h-6 w-6 text-white" />}
                maxWidth="2xl"
            >
                <form onSubmit={handleEdit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Vendor Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Tech Solutions Inc."
                                required
                                className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-white text-gray-900"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                            <input
                                type="email"
                                placeholder="vendor@example.com"
                                required
                                className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-white text-gray-900"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Contact Person</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full rounded-xl border-2 border-gray-200 p-4 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all bg-white text-gray-900"
                                value={formData.contactPerson}
                                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                            <TagInput
                                tags={formData.tags}
                                onChange={(tags) => setFormData({ ...formData, tags })}
                                placeholder="Add a tag (e.g., hardware, software)"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowEditModal(false);
                                setSelectedVendor(null);
                                setFormData({ name: '', email: '', contactPerson: '', tags: [] });
                            }}
                            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <CheckBadgeIcon className="h-5 w-5" />
                            Update Vendor
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedVendor(null);
                }}
                title="Confirm Delete"
                icon={<ExclamationTriangleIcon className="h-6 w-6 text-white" />}
                maxWidth="md"
            >
                <div className="space-y-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                        <p className="text-gray-900 font-semibold mb-2">
                            Are you sure you want to delete this vendor?
                        </p>
                        <p className="text-gray-700 font-bold text-lg mb-1">
                            {selectedVendor?.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                            This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            onClick={() => {
                                setShowDeleteModal(false);
                                setSelectedVendor(null);
                            }}
                            className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
                        >
                            No, Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 px-8 py-3 rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <TrashIcon className="h-5 w-5" />
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Vendors Grid - Compact Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {vendors.map((vendor, index) => (
                    <div
                        key={vendor._id as unknown as string}
                        className="bg-white rounded-lg sm:rounded-2xl border-2 border-gray-200 hover:border-purple-400 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                        {/* Colored Accent Bar */}
                        <div className={`h-1 sm:h-2 ${index % 3 === 0 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : index % 3 === 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}></div>

                        <div className="p-3 sm:p-6">
                            {/* Vendor Name with Actions */}
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0 ${index % 3 === 0 ? 'bg-gradient-to-br from-purple-500 to-pink-500' : index % 3 === 1 ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-indigo-500 to-purple-500'}`}>
                                        <UserGroupIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base sm:text-xl font-black text-gray-900 truncate">{vendor.name}</p>
                                        {vendor.contactPerson && (
                                            <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{vendor.contactPerson}</p>
                                        )}
                                    </div>
                                </div>
                                {/* Action Buttons - Always Visible on Mobile */}
                                <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0">
                                    <button
                                        onClick={() => openEditModal(vendor)}
                                        className="p-1.5 sm:p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md sm:rounded-lg transition-all sm:opacity-0 sm:group-hover:opacity-100"
                                        title="Edit vendor"
                                    >
                                        <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(vendor)}
                                        className="p-1.5 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-md sm:rounded-lg transition-all sm:opacity-0 sm:group-hover:opacity-100"
                                        title="Delete vendor"
                                    >
                                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg sm:rounded-xl mb-2 sm:mb-3 border border-gray-200">
                                <div className="p-1.5 sm:p-2 bg-gray-600 rounded-md sm:rounded-lg flex-shrink-0">
                                    <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">{vendor.email}</p>
                            </div>

                            {/* Tags */}
                            {vendor.tags && vendor.tags.length > 0 && (
                                <div className="flex items-start gap-1.5 sm:gap-2">
                                    <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-md sm:rounded-lg mt-0.5 flex-shrink-0">
                                        <TagIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                    </div>
                                    <div className="flex-1 flex flex-wrap gap-1.5 sm:gap-2">
                                        {vendor.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-xs font-bold text-amber-800 border border-amber-300"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {vendors.length === 0 && (
                <div className="bg-white rounded-2xl border-2 border-dashed border-purple-300 p-12 text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl mb-4">
                        <UserGroupIcon className="h-12 w-12 text-purple-600" />
                    </div>
                    <p className="text-gray-900 text-xl font-bold mb-2">No vendors found.</p>
                    <p className="text-gray-600 mb-6">Add your first vendor to get started.</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Add Your First Vendor
                    </button>
                </div>
            )}
        </div>
    );
}
