"use client";

import Navbar from "@/components/Navbar/page";
import { useEffect, useState } from 'react';
import PostList from "./PostList";

async function getPosts() {
    try {
        const res = await fetch('http://localhost:8000/user-api/posts');
        const data = await res.json();
        return data;
    }
    catch (err) {
        console.error(err);
    }
}

export default function Post() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (err) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    console.log(posts);

    return (
        <>
            <Navbar />
            <div className="w-screen h-fit p-7 bg-red-500">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div>
                        <select className="border p-2 rounded mr-2">
                            <option>Select Category</option>
                            <option>All Category</option>
                            {/* Add more options as needed */}
                        </select>
                        <select className="border p-2 rounded mr-2">
                            <option>Select Location</option>
                            <option>All Location</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded">
                        Find it now
                    </button>
                </div>
            </div>
            <div className="bg-blue-500 p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {!loading && posts.length === 0 && (
                        <p className='text-xl font-semibold text-slate-700'>
                            No posts found!
                        </p>
                    )}
                    {loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    )}
                    {!loading && posts && posts.map((post: { id: number }) => (
                        <PostList key={post.id} post={post} />
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
                <button className="bg-blue-500 text-white py-2 px-4 rounded mx-1">1</button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mx-1">2</button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mx-1">3</button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mx-1">{'>'}</button>
            </div>
        </>
    );
}
