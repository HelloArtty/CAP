"use client";

import AxiosLib from '@/app/lib/axiosInstance';
import Navbar from '@/components/Navbar/page';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloudUploadOutline } from 'react-icons/io5';

export default function UpdatePostPage() {
    const router = useRouter();
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const adminID = token ? JSON.parse(atob(token.split('.')[1])).id : '';
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (post?.image) {
            setSelectedImage(post.image);
        }
        if (post) {
            setValue('title', post.title);
            setValue('description', post.itemDetail);
            setValue('placedetail', post.placeDetail);
            setValue('category', post.categoryID?.categoryID);
            setValue('location', post.placeID?.placeID);
        }
    }, [post, setValue]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isAdmin = checkIfUserIsAdmin();
            if (!isAdmin) {
                router.back();
            }
        }
    }, []);

    const checkIfUserIsAdmin = () => {
        const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
        return userRole === 'admin';
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await AxiosLib.get(`/user-api/posts-id-get?id=${id}`);
                setPost(res.data);
                setLoading(false);
            } catch (err) {
                setError(error);
                console.error("Error fetching post:", err);
                setLoading(false);
            }
        };
        if (id) {
            fetchPost();
        }
    }, [id]);

    const updatePost = async (postData: FormData) => {
        try {
            const response = await AxiosLib.put(`/user-api/posts-id-mod?id=${id}`, postData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                router.push('/admin');
            }
            return response.data;
        } catch (error) {
            console.error("Update post error:", error);
            throw new Error("Failed to update post");
        }
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        const postData = new FormData();
        postData.append('categoryID', data.category);
        postData.append('placeID', data.location);
        postData.append('adminID', adminID);
        postData.append('title', data.title);
        postData.append('itemDetail', data.description);
        postData.append('placeDetail', data.placedetail);
        if (selectedImage) {
            postData.append('image', selectedImage);
        }
        try {
            await updatePost(postData);
            setLoading(false);
        } catch (error) {
            console.error("Failed to update post:", error);
            setLoading(false);
        }
    };

    const handleFileClick = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setUploadedImageUrl(URL.createObjectURL(file));
        }
    };

    const locations = [
        { value: 0, name: "(N1) อาคารศูนย์ต้อนรับ" },
        { value: 1, name: "(N2) อาคารสำนักงานอธิการบดี" },
        { value: 2, name: "(N3) อาคารภาควิชาเคมี" },
        { value: 3, name: "(N4) อาคารภาควิชาฟิสิกส์-คณิตศาสตร์" },
        { value: 4, name: "(N5) อาคารศูนย์เครื่องมือวิทยาศาสตร์เพื่อมาตรฐานและอุตสาหกรรม" },
        { value: 5, name: "(N6) อาคารภาควิชาจุลชีววิทยา" },
        { value: 6, name: "(N7) อาคารปฏิบัติการพื้นฐานทางวิทยาศาสตร์" },
        { value: 7, name: "(N8) สถานีสูบน้ำ" },
        { value: 8, name: "(N9) อาคารสถาบันวิทยาการหุ่นยนต์ภาคสนาม" },
        { value: 9, name: "(N10) อาคารสำนักหอสมุด" },
        { value: 10, name: "(N11) อาคารคณะเทคโนโลยีสารสนเทศ" },
        { value: 11, name: "(N12) อาคารอเนกประสงค์" },
        { value: 12, name: "(N13) อาคาร Workshop and Greenhouse" },
        { value: 13, name: "(N14) อาคารไฟฟ้าแรงสูง" },
        { value: 14, name: "(N15) อาคารเรียนและปฏิบัติการทางศิลปศาสตร์" },
        { value: 15, name: "(N16) อาคาร Learning Exchange" },
        { value: 16, name: "(N17) อาคารเรียนรวม 2" },
        { value: 17, name: "(N18) อาคารปฏิบัติการทางวิศวกรรมอุตสาหการ 4" },
        { value: 18, name: "(N19) อาคารปฏิบัติการทางวิศวกรรมอุตสาหการ 5" },
        { value: 19, name: "(N20) อาคารเรียนรวม 1" },
        { value: 20, name: "(S1) อาคารวิศวกรรมเครื่องกล 4" },
        { value: 21, name: "(S2) อาคารที่จอดรถ" },
        { value: 22, name: "(S3) โรงเรียนดรุณสิกขาลัย" },
        { value: 23, name: "(S4) อาคารวิศววัฒนะ" },
        { value: 24, name: "(S5) บ้านธรรมรักษา 2 (หอพักชาย)" },
        { value: 25, name: "(S6) บ้านธรรมรักษา 1 (หอพักหญิง)" },
        { value: 26, name: "(S7) อาคารพัฒนาเด็กเล็ก มจธ." },
        { value: 27, name: "(S8) อาคารวิจัยและพัฒนาเทคโนโลยีวัสดุ" },
        { value: 28, name: "(S9) อาคารเรียนและปฏิบัติการคณะพลังงาน สิ่งแวดล้อมและวัสดุ" },
        { value: 29, name: "(S10) อาคาร KMUTT Green Society" },
        { value: 30, name: "(S11) อาคารเรียนรวม 5" },
        { value: 31, name: "(S12) อาคารเรียนรวม 4" },
        { value: 32, name: "(S13) อาคารเรียนรวม 3" },
        { value: 33, name: "(S14) อาคารพระจอมเกล้าราชานุสรณ์ 190 ปี" },
        { value: 34, name: "(S15) อาคารภาควิชาวิศวกรรมเคมี" }
    ];

    const locationOptions = locations.map((location) => (
        <option key={location.value} value={location.value}>{location.name}</option>
    ));

    return (
        <>
            <Navbar />
            <div className="w-full min-h-screen">
                <div className="flex justify-center p-10">
                    <h1 className="text-6xl font-bold">Update Post</h1>
                </div>
                <div className="flex justify-center items-start w-full min-h-screen p-10">
                    <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8 flex flex-col md:flex-row">
                        <div className="bg-gray-100 w-full md:w-1/2 flex justify-center items-center p-4 mb-6 md:mb-0 md:mr-6 rounded-lg">
                            <div className="w-3/4">
                                {!uploadedImageUrl && !selectedImage && !post?.image && (
                                    <div
                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 p-10 text-center rounded-lg cursor-pointer relative"
                                        onClick={handleFileClick}
                                    >
                                        <IoCloudUploadOutline className="w-16 h-16 text-gray-500 mb-4" />
                                        <span className="text-gray-700">Drop files to upload or</span>
                                        <span className="text-blue-500">browse</span>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                )}
                                {(uploadedImageUrl || selectedImage || post?.image) && (
                                    <div className="mt-4 relative">
                                        <img
                                            src={uploadedImageUrl || (post && post.image)}
                                            alt="Uploaded"
                                            className="w-full h-auto object-cover rounded-lg"
                                        />
                                        <button
                                            className="absolute top-0 right-0 mr-2 mt-2 bg-red-500 text-white px-2 py-1 rounded-full"
                                            onClick={() => {
                                                setUploadedImageUrl(null);
                                                setSelectedImage(null);
                                                setPost((prevState: typeof post) => ({ ...prevState, image: null }));
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-4">
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label htmlFor="title" className="block text-gray-700 font-medium">Title</label>
                                    <input
                                        type="text"
                                        id="title"
                                        defaultValue={post?.title}
                                        {...register('title', { required: true })}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                    />
                                    {errors.title && <span className="text-red-500">Title is required</span>}
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-gray-700 font-medium">Category</label>
                                    <select
                                        id="category"
                                        defaultValue={post?.categoryID?.categoryID}
                                        {...register('category', { required: true })}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                    >
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
                                    {errors.category && <span className="text-red-500">Category is required</span>}
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-gray-700 font-medium">Location</label>
                                    <select
                                        id="location"
                                        defaultValue={post ? locations.findIndex(location => location.value === post?.placeID?.placeID) : ''}
                                        {...register('location', { required: true })}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                    >
                                        {locationOptions}
                                    </select>
                                    {errors.location && <span className="text-red-500">Location is required</span>}
                                </div>
                                <div>
                                    <label htmlFor="placedetail" className="block text-gray-700 font-medium">Place Detail</label>
                                    <textarea
                                        id="placedetail"
                                        defaultValue={post?.placeDetail}
                                        {...register('placedetail', { required: true })}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                        minLength={20}
                                        maxLength={250}
                                    />
                                    {errors.placedetail && <span className="text-red-500">Place Detail is required</span>}
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-gray-700 font-medium">Description</label>
                                    <textarea
                                        id="description"
                                        defaultValue={post?.itemDetail}
                                        {...register('description', { required: true })}
                                        className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:border-blue-500"
                                        minLength={20}
                                        maxLength={500}
                                    />
                                    {errors.description && <span className="text-red-500">Description is required</span>}
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-500 text-white p-2 rounded w-1/2"
                                    >
                                        {loading ? 'Updating...' : 'Update Post'}
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.back();
                                        }}
                                        className="text-gray-300 p-2 rounded w-1/2 border-2 border-gray-300">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
