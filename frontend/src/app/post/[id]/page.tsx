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

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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

    const checkIfUserIsAdmin = () => {
        const userRole = localStorage.getItem('role');
        return userRole === 'admin';
    };

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

    const handleEditClick = () => {
        router.push(`/update/${post?.postID}`);
    };

    const handleDeleteClick = async () => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await AxiosLib.delete(`/user-api/posts-id-mod?id=${post?.postID}`);
                Swal.fire('Deleted!', 'The post has been deleted.', 'success').then(() => {
                    router.push('/admin');
                });
            } catch (err) {
                Swal.fire('Error!', 'There was an error deleting the post.', 'error');
                console.error("Error deleting post:", err);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching post.</p>;
    if (!post) return <p>Post not found.</p>;

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12">
                <div className="flex flex-wrap -mx-4 items-center justify-center">
                    <div className="relative flex justify-center items-center w-full md:w-1/2 xl:w-1/2 p-4">
                        <button
                            onClick={() => router.back()}
                            className="absolute top-0 left-0 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Back
                        </button>
                        <img
                            className="w-[300px] h-[300px] object-cover rounded-lg shadow-md"
                            src={post?.image}
                            alt={post?.title}
                        />
                    </div>
                    <div className="w-full md:w-1/2 xl:w-1/2 p-4 mt-5">
                        <h1 className="text-6xl font-bold text-blue-text">{post?.title}</h1>
                        <p className="text-lg font-medium text-gray-500 ">{post?.categoryID?.cateName}</p>
                        <p className="text-blue-text text-lg mt-2">
                            <span className="font-semibold text-xl text-blue-text">Description: </span>
                            {post?.itemDetail}
                        </p>
                        <p className="text-blue-text text-lg mt-2">
                            <span className="font-semibold text-xl text-blue-text">Location: </span>
                            {post?.placeID?.placeName}
                        </p>
                        <p className="text-blue-text text-lg mt-2">
                            <span className="font-semibold text-xl text-blue-text">Date: </span>
                            {formatDate(post?.datePost)}
                        </p>
                        <div className="mt-6">
                            {checkIfUserIsAdmin() ? (
                                <>
                                    <button onClick={handleEditClick} className="bg-blue-main hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                                        Edit
                                    </button>
                                    <button onClick={handleDeleteClick} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleRequestClick} className="bg-blue-main hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Request
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
