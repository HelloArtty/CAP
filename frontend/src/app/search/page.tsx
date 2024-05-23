"use client";

import Navbar from "@/components/Navbar/page";
import { useEffect, useState } from 'react';
import PostList from "./PostList";

async function getPosts() {
    try {
        const res = await fetch('http://127.0.0.1:8000/user-api/posts');
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getFilteredPosts(searchQuery: string) {
    try {
        const res = await fetch(`http://127.0.0.1:8000/user-api/posts-filter?${searchQuery}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default function Post() {
    const [posts, setPosts] = useState<object[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [asc, setAsc] = useState(true);

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

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value);
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLocation(e.target.value);
    };

    const handleSearchClick = async () => {
        setLoading(true);
        try {
            const searchQuery = new URLSearchParams({
                cate_id: category,
                place_id: location,
                asc: asc.toString(),
            }).toString();
            
            const data = await getFilteredPosts(searchQuery);
            setPosts(data);
            console.log(data);
            console.log(searchQuery);
        } catch (err) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-screen h-fit p-7 bg-red-500">
                <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div>
                        <select className="border p-2 rounded mr-2"
                            onChange={handleCategoryChange}
                            value={category}>
                            <option value="">Select Category</option>
                            <option value="0">Apple Pencil</option>
                            <option value="1">Bag</option>
                            <option value="2">Calculator</option>
                            <option value="3">Card</option>
                            <option value="4">Cup</option>
                            <option value="5">Earphone</option>
                            <option value="6">Eyeglasses</option>
                            <option value="7">Headphone</option>
                            <option value="8">Helmet</option>
                            <option value="9">Key</option>
                            <option value="10">Laptop</option>
                            <option value="11">Mouse</option>
                            <option value="12">Passport</option>
                            <option value="13">Pen</option>
                            <option value="14">Phone</option>
                            <option value="15">Sneaker</option>
                            <option value="16">Umbrella</option>
                            <option value="17">Watch</option>
                            <option value="18">Water Bottle</option>
                            <option value="19">iPad</option>
                        </select>
                        <select className="border p-2 rounded mr-2"
                            onChange={handleLocationChange}
                            value={location}>
                            <option value="">Select Location</option>
                            <option value="0">Location 1</option>
                            <option value="1">Location 2</option>
                        </select>
                        <select className="border p-2 rounded mr-2"
                            onChange={(e) => setAsc(e.target.value === 'true')}
                            value={asc.toString()}>
                            <option value="true">Latest</option>
                            <option value="false">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSearchClick}>
                        Find it now
                    </button>
                </div>
            </div>
            <div className="bg-blue-500 p-4 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <p className='text-xl text-slate-700 text-center w-full'>
                            Loading...
                        </p>
                    ) : (
                        posts.length === 0 ? (
                            <p className='text-xl font-semibold text-slate-700'>
                                No posts found!
                            </p>
                        ) : (
                            posts.map((post) => (
                                <PostList key={post.id} post={post} />
                            ))
                        )
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
                {/* Pagination buttons */}
                <button className="bg-blue-500 text-white py-2 px-4 rounded mx-1">1</button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mx-1">2</button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mx-1">3</button>
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded mx-1">{'>'}</button>
            </div>
        </>
    );
}
