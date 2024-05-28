import AxiosLib from '@/app/lib/axiosInstance';
import Link from 'next/link';
import { useState } from 'react';

import { useEffect } from 'react';

export default function Navbar() {
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');
            setIsLogin(!!token);
            setName(username || '');
            setIsAdmin(role === 'admin');
        }
    }, []);

    const handleLogout = async () => {
        try {
            await AxiosLib.post('/user-api/log-out');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                window.location.href = '/login';
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-white border-b ">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/search" className="flex items-center">
                            <span className="text-2xl font-semibold">Finder</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        {isLogin ? (
                            <div className="flex items-center">
                                <Link href="#" className="mx-4 text-gray-800 hover:text-gray-600">
                                    {name}
                                </Link>
                                {isAdmin && (
                                    <div>
                                        <Link href="/admin" className="mx-4 text-gray-800 hover:text-gray-600">
                                            Dashboard
                                        </Link>
                                        <Link href="/create" className="mx-4 text-gray-800 hover:text-gray-600">
                                            Create Post
                                        </Link>
                                    </div>
                                )}
                                <button
                                    className="mx-4 text-gray-800 hover:text-gray-600"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Link href="/login" className="mx-4 text-gray-800 hover:text-gray-600">
                                    Login
                                </Link>
                                <Link href="/register" className="mx-4 text-gray-800 hover:text-gray-600">
                                    Signup
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                        >
                            <svg
                                className={`h-6 w-6 ${menuOpen ? 'hidden' : 'block'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <svg
                                className={`h-6 w-6 ${menuOpen ? 'block' : 'hidden'}`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`md:hidden ${menuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {isLogin ? (
                        <>
                            <Link href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-gray-600">
                                {name}
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-gray-600">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-gray-600"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-gray-600">
                                Login
                            </Link>
                            <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:text-gray-600">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
