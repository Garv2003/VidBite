interface ErrorDisplayProps {
    error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => (
    <div className="p-4 mt-4 bg-red-800 text-red-200 border border-red-600 rounded-md">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
    </div>
);
