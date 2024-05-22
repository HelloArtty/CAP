export default function PostList({post}: {post: any}) {

    return (
        <>
            <div>
                <div className="bg-b">
                    <h1>{post.title}</h1>
                    <p>{post.datePost}</p>
                    <p>{post.placeID.placeName}</p>
                    <p>{post.itemDetail}</p>
                    <p>{post.categoryID.cateName}</p>
                </div>
            </div>
        </>
    );
}
