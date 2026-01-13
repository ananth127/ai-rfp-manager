'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Create RFP', href: '/create' },
    { name: 'Vendors', href: '/vendors' },
];

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="glass-effect border-b border-white/20 sticky top-0 z-50 shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center space-x-2 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                                    <SparklesIcon className="relative h-8 w-8 text-indigo-600" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    ProcureAI
                                </span>
                            </Link>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all group ${isActive(item.href)
                                            ? 'text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md'
                                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50'
                                        }`}
                                >
                                    <span className="relative z-10">{item.name}</span>
                                    {!isActive(item.href) && (
                                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            className="relative inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <div className="relative w-6 h-6">
                                <XMarkIcon
                                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}
                                    aria-hidden="true"
                                />
                                <Bars3Icon
                                    className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu with Active Highlighting */}
            <div
                className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="border-t border-white/20 bg-white/50 backdrop-blur-sm">
                    <div className="space-y-1 px-4 py-3">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all ${isActive(item.href)
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-indigo-600'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
