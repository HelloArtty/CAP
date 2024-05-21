"use client"

import Navbar from '@/components/Navbar/page';
import PostItem from '@/components/PostItem/page';

export default function Item() {
    return (
        <>
        <Navbar />
        <PostItem />
            <div>
                <h1>Item Page</h1>
            </div>
        </>
    );
}