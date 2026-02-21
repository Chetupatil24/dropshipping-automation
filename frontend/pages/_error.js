function Error({ statusCode }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="text-center p-8">
                <h1 className="text-9xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {statusCode || '404'}
                </h1>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                    {statusCode
                        ? `An error ${statusCode} occurred on server`
                        : 'Page Not Found'}
                </p>
                <p className="text-gray-600 mb-8">
                    Sorry, we could not find the page you are looking for.
                </p>
                <a
                    href="/"
                    className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all hover:scale-105 shadow-lg"
                >
                    Go to Homepage
                </a>
            </div>
        </div>
    );
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode };
};

export default Error;
