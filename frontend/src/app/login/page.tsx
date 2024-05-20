"use client";
import AxiosLib from '@/app/lib/axios';
import { TextField } from '@mui/material';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Login() {
    const [login, setLogin] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    };
    const loginUser = {
        email: login.email,
        password: login.password,
    };
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await AxiosLib.post('/user-api/log-in', loginUser)
            if (result.status === 200)
                return (window.location.href = '/item')
            console.log(result)
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email or Password is incorrect',
            })
            console.log(error)
        }
    }

    return (
        <>
            <div className="items-center justify-center flex min-h-screen w-full h-full">
                <div className="bg-blue-700 min-h-screen w-1/2 p-8 hidden md:block">
                    <div className="p-8 min-h-screen items-center justify-center flex">
                        <div className="max-w-md p-8 text-center">
                            <h2 className="text-2xl text-gray-100 mb-2">
                                Welcome to
                            </h2>
                            <h1 className="text-8xl text-white font-bold mb-3">
                                Finder
                            </h1>
                            <h3 className="text-sm text-gray-200  mb-2">
                                If you've lost something, worry not. We're here to help you locate it quickly and easily.
                                Let's get started on finding what you've lost!
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-full md:w-1/2 p-8 min-h-screen flex items-center justify-center ">
                    <div className="max-w-md bg-white p-8 w-full flex flex-col justify-center">
                        <h2 className="text-2xl font-bold mb-2">
                            Login
                        </h2>
                        <h3 className="text-sm text-gray-600 mb-4">
                            Welcome! Please fill email and password to login into your account.
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="mb-4">
                                <TextField
                                    className="w-full px-3 pl-0 text-sm border rounded-lg "
                                    label="Email"
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={handleChange}
                                />
                            </div>
                            {/* Password */}
                            <div className="mb-4">
                                <TextField
                                    className='w-full px-3 pl-0 text-sm border rounded-lg'
                                    label="Password"
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </div>
                            <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700">
                                Login
                            </button>
                        </form>
                        <p className="mt-4 text-center text-sm">
                            Don’t have an account? &nbsp;
                            <Link href="/register" className="text-blue-700 hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

