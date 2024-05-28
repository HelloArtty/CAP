"use client";

import AxiosLib from "@/app/lib/axiosInstance";
import PostList from "@/app/search/PostList";
import { updateURLParams } from "@/app/utils/utils";
import Navbar from '@/components/Navbar/page';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useEffect, useState } from 'react';

async function getPosts() {
    try {
        const res = await AxiosLib.get('/user-api/posts');
        const data = res.data;
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function getFilterPosts(searchQuery: string) {
    try {
        const res = await AxiosLib.get(`/user-api/posts-filter?${searchQuery}`);
        const data = res.data;
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
}

export default function Post() {
    const [posts, setPosts] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [asc, setAsc] = useState(true);


    const fetchData = async (searchQuery = '') => {
            setLoading(true);
            setError(null);
            try {
                const data = searchQuery ? await getFilterPosts(searchQuery) : await getPosts();
                setPosts(data);
            } catch (err) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };


        useEffect(() => {
            const params = new URLSearchParams(window.location.search);
            const searchTermParam = params.get('search') || '';
            const categoryParam = params.get('category') || '';
            const locationParam = params.get('location') || '';
            const ascParam = params.get('asc') !== 'false';

            setSearchTerm(searchTermParam);
            setCategory(categoryParam);
            setLocation(locationParam);
            setAsc(ascParam);

            const searchQuery = new URLSearchParams({
                search: searchTermParam,
                cate_id: categoryParam,
                place_id: locationParam,
                asc: ascParam.toString(),
            }).toString();

            fetchData(searchQuery);
        }, []);

        const handleSearch = async (e: React.SyntheticEvent) => {
            e.preventDefault();
            const searchQuery = new URLSearchParams({
                search: searchTerm,
                cate_id: category,
                place_id: location,
                asc: asc.toString(),
            }).toString();
            updateURLParams({ search: searchTerm });
            fetchData(searchQuery);
        };

        const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setCategory(value);
            updateURLParams({ category: value });
        };

        const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setLocation(value);
            updateURLParams({ location: value });
        };

        const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value === 'true';
            setAsc(value);
            updateURLParams({ asc: value.toString() });
        };

        const handleSearchClick = async () => {
            const searchQuery = new URLSearchParams({
                search: searchTerm,
                cate_id: category,
                place_id: location,
                asc: asc.toString(),
            }).toString();
            fetchData(searchQuery);
        };

        return (
            <>
                <div className="bg-blue-light">
                    <Navbar />
                    <div className="container mx-auto pt-4">
                        <div className="flex flex-wrap justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
                            <div className="min-w-fit md:w-auto mb-4 md:mb-0 pt-4">
                                <form className="flex items-center" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </form>
                            </div>
                            <div className="w-full md:w-auto flex space-x-2 flex-wrap">
                                <select
                                    className="border p-2 rounded"
                                    onChange={handleCategoryChange}
                                    value={category}
                                >
                                    <option value="">Select Category</option>
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
                                <select
                                    className="border p-2 rounded"
                                    onChange={handleLocationChange}
                                    value={location}
                                >
                                    <option value="">Select Location</option>
                                    <option value="0">Location 1</option>
                                    <option value="1">Location 2</option>
                                </select>
                                <select
                                    className="border p-2 rounded"
                                    onChange={handleSortChange}
                                    value={asc.toString()}
                                >
                                    <option value="true">Latest</option>
                                    <option value="false">Oldest</option>
                                </select>
                            </div>
                            <button className="bg-blue-500 text-white py-2 px-4 ml-2 rounded" onClick={handleSearchClick}>
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="container mx-auto p-4 md:p-8 ">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {loading ? (
                                <p className="text-xl text-slate-700 text-center w-full">Loading...</p>
                            ) : (
                                posts.length === 0 ? (
                                    <p className="text-xl font-semibold text-slate-700">No posts found!</p>
                                ) : (
                                    posts.map((post) => (
                                        <PostList key={post.id} post={post} />
                                    ))
                                )
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
