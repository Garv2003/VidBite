import { useEffect, useState } from 'react';
import showdown from 'showdown';
import { Button } from '@/components/ui/button';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

interface SummarizeResponse {
    summary?: string;
}

export const Summary = () => {
    const [url, setUrl] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [thumbnail, setThumbnail] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSummary('');

        try {
            const response = await fetch('http://localhost:5013/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data: SummarizeResponse = await response.json();
            if (data.summary) {
                const converter = new showdown.Converter();
                const html = converter.makeHtml(data.summary);
                setSummary(html);
            } else {
                setError('No summary returned from the server.');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const fetchThumbnail = () => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        if (videoId) {
            setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        } else {
            setThumbnail('');
        }
    };

    // Fetch thumbnail when the URL changes
    useEffect(() => {
        fetchThumbnail();
    });

    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submitted");
    };

    return (
        <div className="bg-black min-h-screen flex justify-center items-center">
            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
            />
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-6">
                <h1 className="text-4xl font-extrabold text-center text-indigo-400 mb-4">
                    YouTube Video Summarizer
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        placeholder="Enter YouTube video URL"
                        value={url}
                        onInput={(e) => setUrl(e.currentTarget.value)}
                        onChange={fetchThumbnail}
                        required
                        className="w-full px-4 py-3 text-lg border rounded-md border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />

                    {/* Show video thumbnail if URL is valid */}
                    {thumbnail && (
                        <div className="mt-4 flex justify-center">
                            <img
                                src={thumbnail}
                                alt="Video Thumbnail"
                                className="w-32 h-32 object-cover rounded-md shadow-lg"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    >
                        Summarize
                    </Button>
                </form>

                {/* Display error message */}
                {error && (
                    <div className="p-4 mt-4 bg-red-800 text-red-200 border border-red-600 rounded-md">
                        <p className="font-semibold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                {/* Display summary */}
                {summary && (
                    <div
                        innerHTML={summary}
                        className="mt-6 w-full p-4 bg-gray-700 border border-gray-600 rounded-md shadow-sm resize-none text-white overflow-auto"
                    />
                )}
            </div>
        </div>
    );
}

