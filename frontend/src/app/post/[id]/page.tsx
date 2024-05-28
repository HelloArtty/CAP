"use client";

import AxiosLib from '@/app/lib/axiosInstance';
import Navbar from '@/components/Navbar/page';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState([] as any);
    console.log("{ID}:", id);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await AxiosLib.get(`/user-api/posts-id-get?id=${id}`);
                setPost(res.data);
                setLoading(false);
            } catch (err) {
                setError(error);
                console.error("Error fetching post:", err);
            }
        }
        fetchPost();
    }, [id]);
    console.log("Post:", post);




    if (loading) return <p>Loading...</p>;

    return (
        <>
            <Navbar />
            <div className="w-full flex min-h-screen">

                <div className="flex flex-col justify-center items-center w-1/2 bg-red-500 ">
                    <div >
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.back();
                            }}>
                            back
                        </button>
                    </div>
                    <img
                        className="w-[300px] h-[300px]"
                        src={post?.image} />
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
                    </div>
                </div>
            </div >
        </>
    );
}
