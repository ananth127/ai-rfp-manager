'use client';

import { useState, KeyboardEvent } from 'react';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/solid';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = 'Add tag...' }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleAddTag = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    const startEditing = (index: number) => {
        setEditingIndex(index);
        setEditValue(tags[index]);
    };

    const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishEditing(index);
        } else if (e.key === 'Escape') {
            setEditingIndex(null);
            setEditValue('');
        }
    };

    const finishEditing = (index: number) => {
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== tags[index]) {
            const newTags = [...tags];
            newTags[index] = trimmed;
            onChange(newTags);
        }
        setEditingIndex(null);
        setEditValue('');
    };

    return (
        <div className="space-y-3">
            {/* Tags Display */}
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <div
                        key={index}
                        className="group relative"
                    >
                        {editingIndex === index ? (
                            // Editing Mode
                            <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => handleEditKeyDown(e, index)}
                                onBlur={() => finishEditing(index)}
                                autoFocus
                                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-2 border-amber-400 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                style={{ minWidth: '80px' }}
                            />
                        ) : (
                            // Display Mode
                            <div
                                onClick={() => startEditing(index)}
                                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-300 font-bold text-sm cursor-pointer hover:from-amber-200 hover:to-orange-200 transition-all flex items-center gap-2"
                            >
                                <span>{tag}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveTag(index);
                                    }}
                                    className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-0.5 hover:bg-amber-300 rounded-full"
                                    title="Remove tag"
                                >
                                    <XMarkIcon className="h-3.5 w-3.5 text-amber-700" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add New Tag Input */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all bg-white text-gray-900"
                />
                <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!inputValue.trim()}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-md"
                >
                    <PlusIcon className="h-4 w-4" />
                    Add
                </button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500">
                Click tag to edit, hover to remove. Press Enter to add.
            </p>
        </div>
    );
}
