interface ErrorStateProps {
    error: unknown;
}

export const ErrorState = ({ error }: ErrorStateProps) => (
    <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
            <div className="p-4 bg-red-800 text-red-200 border border-red-600 rounded-md">
                <p className="font-semibold">Error</p>
                <p>{error instanceof Error ? error.message : 'An error occurred'}</p>
            </div>
        </div>
    </div>
);