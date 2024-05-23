export default function PostList({ post }: { post: any }) {

    return (
        <>
            <div className="flex justify-center ">
                <div className="w-64 h-1/2 bg-green-500">
                    <div className="bg-white">
                        <img className=" w-auto h-64 object-cover"
                            src="https://mobileimages.lowes.com/productimages/9ac9fc52-1ae7-495d-aaf9-3c3acfdf5002/65232316.jpg?size=pdhism" />
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
