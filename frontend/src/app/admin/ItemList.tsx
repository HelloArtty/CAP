"use client";

import { Table } from "flowbite-react";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export function ItemList({ post }: { post: any }) {
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    return (
        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 h-full w-full">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <img src={post?.image} className="w-10 h-10 rounded-full" />
            </Table.Cell>
            <Table.Cell>
                <span>{post?.title}</span>
            </Table.Cell>
            <Table.Cell>
                <span>{post?.categoryID?.cateName}</span>
            </Table.Cell>
            <Table.Cell>
                <span>{post?.placeID?.placeName}</span>
            </Table.Cell>
            <Table.Cell>
                <span>{formatDate(post?.datePost)}</span>
            </Table.Cell>
            <Table.Cell>
                <div className="flex justify-center items-center">
                    <Link href="#">
                        <p className="pr-2 font-medium text-gray-600 hover:text-indigo-600">
                            <FaEdit className="h-5 w-5" />
                        </p>
                    </Link>
                    <Link href="#">
                        <p className="font-medium text-red-600 hover:text-red-900">
                            <MdDelete className="h-5 w-5" />
                        </p>
                    </Link>
                </div>
            </Table.Cell>
        </Table.Row>
    );
}