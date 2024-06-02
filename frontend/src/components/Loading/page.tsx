import ReactLoading from 'react-loading';

function Loading() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white">
            <ReactLoading type="spinningBubbles" color="#007bff" height={100} width={100} />
        </div>

    );
}
export default Loading;
