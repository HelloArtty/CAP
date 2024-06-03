"use client";

import AxiosLib from "@/app/lib/axiosInstance";
import { Table } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

export function ItemList({ post }: { post: any }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const clicklink = () => {
        localStorage.setItem('postID', post?.postID);
        router.push(`/post/${post?.postID}`);
    }

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const handleDelete = async () => {
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
                    location.reload();
                });
            } catch (err) {
                Swal.fire('Error!', 'There was an error deleting the post.', 'error');
                console.error("Error deleting post:", err);
            }
        }
    };

    return (
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 h-full w-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            onClick={clicklink}>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <img src={post?.image} className="w-10 h-10 rounded-full object-cover cursor-pointer" alt="Post image" />
            </Table.Cell>
            <Table.Cell>
                <span className="text-gray-900 dark:text-white ">{post?.title}</span>
            </Table.Cell>
            <Table.Cell>
                <span className="text-gray-900 dark:text-white">{post?.categoryID?.cateName}</span>
            </Table.Cell>
            <Table.Cell>
                <span className="text-gray-900 dark:text-white">{post?.placeID?.placeName}</span>
            </Table.Cell>
            <Table.Cell>
                <span className="text-gray-900 dark:text-white">{formatDate(post?.datePost)}</span>
            </Table.Cell>
            <Table.Cell>
                <div className="flex justify-center items-center space-x-4" onClick={stopPropagation}>
                    <Link href={`/update/${post?.postID}`}>
                        <p className="pr-2 font-medium text-gray-600 hover:text-indigo-600">
                            <FaEdit className="h-5 w-5" />
                        </p>
                    </Link>
                    <button onClick={handleDelete} >
                        <p className="font-medium text-red-600 hover:text-red-900">
                            <MdDelete className="h-5 w-5" />
                        </p>
                    </button>
                </div>
            </Table.Cell>
        </Table.Row>
    );
}
