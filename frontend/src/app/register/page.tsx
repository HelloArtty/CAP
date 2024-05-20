"use client"
import { TextField } from '@mui/material';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AxiosLib from '../lib/axios';

export default function Register() {
  const [register, setRegister] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'auto';
    };
}, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRegister((prevRegister) => ({
      ...prevRegister,
      [e.target.name]: e.target.value
    }));
    console.log('Updated register state:', {
      ...register,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!register.name || !register.email || !register.password || !register.confirmPassword || !register.tel) {
        return Swal.fire('Error', 'Please fill all the fields', 'error');
      } else if (register.name.length < 6) {
        return Swal.fire('Error', 'Username must be at least 6 characters', 'error');
      } else if (register.name.includes(' ')) {
        return Swal.fire('Error', 'Username cannot contain space', 'error');
      } else if (!register.email.includes('@')) {
        return Swal.fire('Error', 'Please fill email correctly', 'error');
      } else if (register.tel.length < 10 || register.tel.length > 10) {
        return Swal.fire('Error', 'Phone number must be at least 10 characters', 'error');
      } else if (register.password.length < 8) {
        return Swal.fire('Error', 'Password must be at least 8 characters', 'error');
      } else if (!register.password.match(/[0-9]/g)) {
        return Swal.fire('Error', 'Password must contain at least one number', 'error');
      } else if (!register.password.match(/[A-Z]/g)) {
        return Swal.fire('Error', 'Password must contain at least one uppercase', 'error');
      } else if (!register.password.match(/[a-z]/g)) {
        return Swal.fire('Error', 'Password must contain at least one lowercase', 'error');
      } else if (!register.password.match(/[^\w\s]/g)) {
        return Swal.fire('Error', 'Password must contain at least one special character', 'error');
      } else if (register.password.includes(' ')) {
        return Swal.fire('Error', 'Password cannot contain space', 'error');
      } else if (register.password !== register.confirmPassword) {
        return Swal.fire('Error', 'Password must match the confirm password', 'error');
      }


      const createNewUser = {
        name: register.name,
        email: register.email,
        tel: register.tel,
        password: register.password,
        confirmPassword: register.confirmPassword,
      };
      console.log('Sending request with data:', createNewUser);

      const result = await AxiosLib.post('/user-api/sign-up', createNewUser);
      console.log(result);
      if (result.status === 201) {
        return (window.location.href = '/login');
      }
    } catch (error) {
      if ((error as any).response.status === 400 || (error as any).response.status === 500 || (error as any).response.status === 409) {
        const errorMessage = typeof (error as any).response.data.message === 'string'
          ? (error as any).response.data.message
          : JSON.stringify((error as any).response.data.message);
        return Swal.fire('Error', errorMessage, 'error');
      } return Swal.fire('Error', 'An error occurred. Please try again later', 'error');
    }
    console.log(register);
  };

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
              <h3 className="text-sm text-gray-200 mb-2">
                If you've lost something, worry not. We're here to help you locate it quickly and easily.
                Let's get started on finding what you've lost!
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white w-full md:w-1/2 p-8 min-h-screen flex items-center justify-center">
          <div className="max-w-md bg-white p-8 w-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-2">
              Create an account
            </h2>
            <h3 className="text-sm text-gray-600 mb-4">
              Find lost items easily with our Lost and Found service. Get started now!
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <TextField
                  className="w-full px-3 pl-0 text-sm border rounded-lg"
                  label="Username"
                  type="text"
                  id="name"
                  name="name"
                  onChange={handleChange}
                />
              </div>
              {/* Email */}
              <div className="mb-4">
                <TextField
                  className="w-full px-3 pl-0 text-sm border rounded-lg"
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                />
              </div>
              {/* Phone */}
              <div className="mb-4">
                <TextField
                  className="w-full px-3 pl-0 text-sm border rounded-lg"
                  label="Phone"
                  type="text"
                  id="tel"
                  name="tel"
                  onChange={handleChange}
                />
              </div>
              {/* Password */}
              <div className="mb-4">
                <TextField
                  className="w-full px-3 pl-0 text-sm border rounded-lg"
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
              </div>
              {/* Confirm Password */}
              <div className="mb-4">
                <TextField
                  className="w-full px-3 pl-0 text-sm border rounded-lg"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </div>
              <button className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-700">
                Create Account
              </button>
            </form>
            <p className="mt-4 text-center text-sm">
              Already have an account? &nbsp;
              <Link href="/login" className="text-blue-700 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
