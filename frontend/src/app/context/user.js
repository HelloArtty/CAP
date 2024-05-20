import { createContext } from 'react';

export const ContextValue = {
    name: '',
    email: '',
    tel:'',
    password: '',
    // confirmPassword: '',
};

export const AuthContext = createContext(null);