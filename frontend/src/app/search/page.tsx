"use client";

import { useEffect, useState } from 'react';
import AxiosLib from '../lib/axios';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        AxiosLib.get('/user-api/posts/')
            .then(response => {
                setPosts(response.data);
                setFilteredPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setFilter(searchTerm);
        setFilteredPosts(posts.filter((post: { title: string }) => post.title.toLowerCase().includes(searchTerm)));
    };

    return (
        <div>
            
        </div>
    );
}
