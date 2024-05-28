import AxiosLib from '@/app/lib/axiosInstance';
import Link from 'next/link';

export default function Navbar() {
    const isLogin = localStorage.getItem('token');
    const name = localStorage.getItem('email');


    const handleLogout = async () => {
        try {
            await AxiosLib.post('/user-api/log-out');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Finder</span>
                </Link>
                <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
                    {isLogin ? (
                        <>
                            <Link href="#" className="group mx-8 transition duration-300 text-white">
                                {name}
                            </Link>
                            <button
                                className="group mx-8 transition duration-300 text-white"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="group mx-8 transition duration-300 text-white">
                                Login
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>
                            </Link>
                            <Link href="/register" className="group mx-8 transition duration-300 text-white">
                                Signup
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-sky-600"></span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
