import { createContext } from 'react';

export const ContextValue = {
    name: '',
    email: '',
    tel:'',
    password: '',
};

export const AuthContext = createContext(null);