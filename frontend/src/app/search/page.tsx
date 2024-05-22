"use client";

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
    const [posts, setPosts] = useState<any[]>([]);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading posts</div>;

    console.log(posts);

    return (
        <>
            <div>
                <h1>Post Title</h1>
                <p>Post Item Detail</p>
                {!loading && posts &&
                    posts.map((post) => (
                        <PostList key={post.id} post={post} />
                    ))}
            </div>
            <div className='flex-1'>
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Posts</h1>
                <div className='p-7 flex flex-wrap gap-4'>
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
                    {!loading &&
                        posts &&
                        posts.map((post) => (
                            <PostList key={post.id} post={post} />
                        ))}
                </div>
            </div>
        </>
    )
}
