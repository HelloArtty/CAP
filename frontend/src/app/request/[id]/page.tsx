"use client";

import AxiosLib from '@/app/lib/axiosInstance';
import Navbar from '@/components/Navbar/page';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

const EmailForm = () => {
    const { id } = useParams();
    const name = localStorage.getItem('username');
    const [post, setPost] = useState<any>(null);
    const subject = `A request from ${name}`;
    const [body, setBody] = useState('');
    const [fromEmail, setFromEmail] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await AxiosLib.get(`/user-api/posts-id-get?id=${id}`);
                setPost(res.data);
            } catch (err) {
                setError('Error fetching post.');
                console.error("Error fetching post:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            setMessage('Please select an image.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('body', `postID = ${id}\nLink: http://localhost:3000/post/${id}\nFrom: ${fromEmail}\n${body}`);
        formData.append('from_email', fromEmail);
        formData.append('image', image);
        console.log("FormData entries:", Array.from(formData.entries()));

        try {
            const response = await AxiosLib.post('/user-api/send-email', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Email sent successfully.');
            router.push('/search');
        } catch (error) {
            setMessage('Error sending email.');
            console.error('Error sending email:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileClick = () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen">
                <div className="flex justify-center p-10">
                    <h1 className="text-6xl font-bold">Send an Email</h1>
                </div>
                <div className="flex justify-center items-start w-full min-h-screen p-10">
                    <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 flex flex-col md:flex-row">
                        <div className="bg-gray-100 w-full md:w-1/2 flex justify-center items-center p-4 mb-6 md:mb-0 md:mr-6 rounded-lg">
                            <div className="w-3/4">
                                {!imagePreviewUrl && (
                                    <div
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 p-10 text-center rounded-lg cursor-pointer"
                                        onClick={handleFileClick}
                                        role="button"
                                        aria-label="Upload Image"
                                    >
                                        <IoCloudUploadOutline className="w-16 h-16 text-gray-500 mb-4" />
                                        <span className="text-gray-700">Drop files to upload or</span>
                                        <span className="text-blue-500">browse</span>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                )}
                                {imagePreviewUrl && (
                                    <div className="mt-4">
                                        <img src={imagePreviewUrl} alt="Selected" className="w-full h-64 object-cover rounded-lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-4">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="body" className="block text-gray-700 font-medium">Body</label>
                                    <textarea
                                        id="body"
                                        value={body}
                                        onChange={(e) => setBody(e.target.value)}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                        required
                                        aria-label="Email Body"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="fromEmail" className="block text-gray-700 font-medium">From Email</label>
                                    <input
                                        type="email"
                                        id="fromEmail"
                                        value={fromEmail}
                                        onChange={(e) => setFromEmail(e.target.value)}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                        required
                                        aria-label="From Email"
                                    />
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button
                                        className="bg-blue-500 text-white p-2 rounded w-1/2"
                                        type="submit"
                                        disabled={loading}
                                        aria-label="Send Email"
                                    >
                                        {loading ? 'Sending...' : 'Send Email'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.back();
                                        }}
                                        className="text-gray-300 p-2 rounded w-1/2 border-2 border-gray-300"
                                        aria-label="Cancel"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {message && <p className="mt-4 text-center">{message}</p>}
                                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmailForm;
