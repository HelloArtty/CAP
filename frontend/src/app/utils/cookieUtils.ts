import Cookies from 'js-cookie';

// Function to check if the token cookie exists
export const checkTokenCookie = () => {
    const token = Cookies.get('token');
    console.log('Token:', token);
    return !!token; // Convert token value to a boolean
};