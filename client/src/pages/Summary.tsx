import { createSignal } from 'solid-js';
import showdown from 'showdown';
import { Button } from '@/components/ui/button';

interface SummarizeResponse {
    summary?: string;
}

function Summary() {
    const [url, setUrl] = createSignal<string>('');
    const [summary, setSummary] = createSignal<string>('');
    const [error, setError] = createSignal<string>('');
    const [thumbnail, setThumbnail] = createSignal<string>('');

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setError('');
        setSummary('');

        try {
            const response = await fetch('http://localhost:5013/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url() }),
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
        const videoId = url().split('v=')[1]?.split('&')[0];
        if (videoId) {
            setThumbnail(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        } else {
            setThumbnail('');
        }
    };

    // Fetch thumbnail when the URL changes
    createSignal(() => {
        fetchThumbnail();
    });

    return (
        <div class="bg-black min-h-screen flex justify-center items-center">
            <div class="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-6">
                <h1 class="text-4xl font-extrabold text-center text-indigo-400 mb-4">
                    YouTube Video Summarizer
                </h1>

                <form onSubmit={handleSubmit} class="space-y-4">
                    <input
                        placeholder="Enter YouTube video URL"
                        value={url()}
                        onInput={(e) => setUrl(e.currentTarget.value)}
                        onChange={fetchThumbnail}
                        required
                        class="w-full px-4 py-3 text-lg border rounded-md border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />

                    {/* Show video thumbnail if URL is valid */}
                    {thumbnail() && (
                        <div class="mt-4 flex justify-center">
                            <img
                                src={thumbnail()}
                                alt="Video Thumbnail"
                                class="w-32 h-32 object-cover rounded-md shadow-lg"
                            />
                        </div>
                    )}

                    <Button
                        type="submit"
                        class="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    >
                        Summarize
                    </Button>
                </form>

                {/* Display error message */}
                {error() && (
                    <div class="p-4 mt-4 bg-red-800 text-red-200 border border-red-600 rounded-md">
                        <p class="font-semibold">Error</p>
                        <p>{error()}</p>
                    </div>
                )}

                {/* Display summary */}
                {summary() && (
                    <div
                        innerHTML={summary()}
                        class="mt-6 w-full p-4 bg-gray-700 border border-gray-600 rounded-md shadow-sm resize-none text-white overflow-auto"
                    />
                )}
            </div>
        </div>
    );
}

export default Summary;
