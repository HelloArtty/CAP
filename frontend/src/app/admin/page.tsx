"use client";
import { ItemList } from '@/app/admin/ItemList';
import AxiosLib from '@/app/lib/axiosInstance';
import Navbar from '@/components/Navbar/page';
import { Table } from "flowbite-react";
import { useEffect, useState } from 'react';

export default function Admin() {
    const [posts, setPosts] = useState([] as any);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const isAdmin = checkIfUserIsAdmin();
        if (!isAdmin) {
            history.back();
        }
    }, []);

    const checkIfUserIsAdmin = () => {
        const userRole = localStorage.getItem('role');
        return userRole === 'admin';
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await AxiosLib.get('/user-api/posts');
                setPosts(res.data);
                setLoading(false);
            } catch (err) {
                setError(error);
                console.error("Error fetching posts:", err);
            }
        }
        fetchPosts();
    }, []);

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen">
                <div className="flex justify-center h-1/2 p-10">
                    <h1 className="text-6xl font-bold">Admin</h1>
                </div>
                {loading ? (
                    <p className="text-xl text-center mt-4">Loading...</p>
                ) : error ? (
                    <p className="text-xl text-center mt-4">Error fetching posts. Please try again later.</p>
                ) : (
                    <div className="flex justify-center p-10 ">
                        <div className="w-full overflow-x-auto shadow-2xl">
                            <Table hoverable>
                                <Table.Head className="">
                                    <Table.HeadCell>Photo</Table.HeadCell>
                                    <Table.HeadCell>Name</Table.HeadCell>
                                    <Table.HeadCell>Category</Table.HeadCell>
                                    <Table.HeadCell>Location</Table.HeadCell>
                                    <Table.HeadCell>Date Post</Table.HeadCell>
                                    <Table.HeadCell className="flex justify-center">Operation</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {posts.map((post: any) => (
                                        <ItemList key={post.id} post={post} />
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};