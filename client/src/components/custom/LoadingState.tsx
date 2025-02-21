export const LoadingState = () => (
    <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
                <div className="h-96 bg-gray-800 rounded-lg"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-800 rounded"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            </div>
        </div>
    </div>
);