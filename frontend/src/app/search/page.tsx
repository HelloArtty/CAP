"use client";

import AxiosLib from "@/app/lib/axiosInstance";
import PostList from "@/app/search/PostList";
import { updateURLParams } from "@/app/utils/utils";
import LoadingPage from '@/components/Loading/page';
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
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 12;
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber: number) => {
        setIsLoading(true);
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000); // 1000 เป็นตัวอย่างเวลาที่ใช้ในการโหลด (ให้ปรับให้เป็นเวลาจริง)
    };





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


    const locationOptions = locations.map((location, index) => {
        let displayText = location.name;
        const maxLength = 25;
        if (displayText.length > maxLength) {
            displayText = displayText.substring(0, maxLength) + '...';
        }
        return <option key={index} value={index}>{displayText}</option>;
    });


    locationOptions.unshift(<option value="">Select Location</option>);


    return (
        <>
            <div className="bg-blue-light">
                <Navbar />
                <div className="container mx-auto pt-4">
                    <div className="flex flex-wrap justify-center items-center mt-6 space-y-4 md:space-y-0 md:space-x-4">
                        <div className="w-full md:w-auto mb-4 md:mb-0">
                            <form className="flex items-center w-full md:w-auto"
                                onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>
                        <div className="w-full md:w-auto text-gray-500 flex flex-wrap space-y-2 md:space-y-0 md:space-x-2">
                            <select
                                className="w-full md:w-auto border border-gray-300  p-2 rounded"
                                onChange={handleCategoryChange}
                                value={category}
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
                            <select
                                className="w-full md:w-auto border border-gray-300 p-2 rounded "
                                onChange={handleLocationChange}
                                value={location}
                            >
                                {locationOptions}
                            </select>
                            <select
                                className="w-full md:w-auto border border-gray-300 p-2 rounded"
                                onChange={handleSortChange}
                                value={asc.toString()}
                            >
                                <option value="true">Latest</option>
                                <option value="false">Oldest</option>
                            </select>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleSearchClick}>
                                Search
                            </button>
                        </div>
                    </div>

                </div>
                <div className="container mx-auto p-4 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            <LoadingPage />
                        ) : (
                            posts.length === 0 ? (
                                <p className="text-xl font-semibold text-slate-700">No posts found!</p>
                            ) : (
                                currentPosts.map((post) => (
                                    <PostList key={post.id} post={post} />
                                ))
                            )
                        )}
                    </div>

                </div>

                {posts.length > postsPerPage && (
                    <div className="flex justify-center mt-4">
                        {[...Array(Math.ceil(posts.length / postsPerPage))].map((_, index) => (
                            <button key={index} onClick={() => paginate(index + 1)} className="mx-1 px-3 py-1 rounded bg-blue-500 text-white">
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
