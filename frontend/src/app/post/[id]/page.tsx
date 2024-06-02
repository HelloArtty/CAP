"use client";

import AxiosLib from '@/app/lib/axiosInstance';
import Navbar from '@/components/Navbar/page';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await AxiosLib.get(`/user-api/posts-id-get?id=${id}`);
                setPost(res.data);
                setLoading(false);
            } catch (err) {
                setError(error);
                console.error("Error fetching post:", err);
                setLoading(false);
            }
        }
        if (id) {
            fetchPost();
        }
    }, [id]);

    
    const handleRequestClick = () => {
        if (!localStorage.getItem('token')) {
            Swal.fire({
                icon: 'error',
                title: 'Please login to request.',
                confirmButtonText: 'Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/login');
                }
            });
        } else {
            router.push(`/request/${id}`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching post.</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <>
            <Navbar />
            <div className="w-full flex min-h-screen">
                <div className="flex flex-col justify-center items-center w-1/2 bg-red-500">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-gray-200 p-2 rounded"
                    >
                        Back
                    </button>
                    <img
                        className="w-[300px] h-[300px]"
                        src={post?.image}
                    />
                </div>
                <div className="flex justify-center items-center w-1/2 bg-blue-500 py-2">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 line-clamp-1">{post?.title}</h1>
                        <div>
                            <p>{post?.categoryID?.cateName}</p>
                        </div>
                        <div>
                            <p>{post?.itemDetail}</p>
                        </div>
                        <div className="flex items-center pt-2 text-gray-600">
                            <p>{post?.datePost}</p>
                        </div>
                        <div className="flex items-center pt-2 text-gray-600">
                            <p>{post?.placeID?.placeName}</p>
                        </div>
                        <button onClick={handleRequestClick} className="text-red-500 cursor-pointer">
                            Request
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
