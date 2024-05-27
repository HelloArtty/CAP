"use client";
import { useEffect } from 'react';

export default function Admin() {

    useEffect(() => {
        document.title = 'Admin';
    }, []);

    return (
        <>
            <div className="">
                <h1>Admin</h1>
            </div>
        </>
    );
};

