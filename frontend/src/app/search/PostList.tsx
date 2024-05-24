export default function PostList({ post }: { post: any }) {
    
    return (
        <>
            <div className="flex justify-center ">
                <div className="w-64 h-1/2 bg-green-500">
                    <div className="bg-white">
                        <img className=" w-auto h-64 object-cover"
                            src={post.image} alt="post"
                        />
                        <h1>{post.title}</h1>
                        <p>{post.datePost}</p>
                        <p>{post.placeID.placeName}</p>
                        <p>{post.itemDetail}</p>
                        <p>{post.categoryID.cateName}</p>
                    </div>
                </div>
            </div>
        </>
    );
}