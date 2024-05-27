import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";

export default function PostList({ post }: { post: any }) {
    const formatDate = (dateString: string) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };  

    return (
        <div className="flex justify-center p-4">
            <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105">
                <img
                    className="w-full h-64 object-cover"
                    src={post.image}
                    alt="post"
                />
                <div className="p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 line-clamp-1">{post.title}</h1>
                    <div className="flex items-center pt-2 text-gray-600">
                        <FaRegCalendarAlt className="mr-2" />
                        <p>{formatDate(post.datePost)}</p>
                    </div>
                    <div className="flex items-center pt-2 text-gray-600">
                        <IoLocation className="mr-2" />
                        <p className="line-clamp-1">{post.placeID.placeName}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
