import AxiosLib from '@/app/lib/axios';
import { useState } from 'react';

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await AxiosLib.post('/user-api/log-out');
            localStorage.removeItem('token');
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700"
            onClick={handleLogout}
            disabled={isLoading}
        >
            {isLoading ? 'Logging out...' : 'Logout'}
        </button>
    );
};


export default LogoutButton;


