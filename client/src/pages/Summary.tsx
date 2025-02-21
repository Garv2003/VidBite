import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Loader2 } from "lucide-react";
import { Navbar } from '@/layouts/Navbar';
import { useYouTubeVideo } from '@/hooks/useYouTubeVideo';
import { usePlaceholders } from '@/hooks/usePlaceholders';
import { ErrorDisplay } from '@/components/custom/ErrorDisplay';
import { VideoPlayer } from '@/components/custom/VideoPlayer';

export const Summary = () => {
    const [name, setName] = useState('Video Name');
    const [error, setError] = useState('');

    const childRef1 = useRef<{ vanishAndSubmit: () => void } | null>(null);
    const childRef2 = useRef<{ vanishAndSubmit: () => void } | null>(null);

    const { urlPlaceholders, namePlaceholders } = usePlaceholders();
    const { videoId, isLoading, handleUrlChange, submitSummaryRequest } = useYouTubeVideo({
        onError: setError
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        childRef1.current?.vanishAndSubmit();
        childRef2.current?.vanishAndSubmit();
        setError('');

        await submitSummaryRequest(name);
    };

    return (
        <div className='container mx-auto p-6'>
            <Navbar />
            <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-4xl p-8 rounded-xl shadow-lg border space-y-6">
                    <h1 className="text-4xl font-extrabold text-center mb-4">
                        YouTube Video Summarizer
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full mt-20 flex flex-col items-center justify-center">
                        <PlaceholdersAndVanishInput
                            placeholders={namePlaceholders}
                            onChange={(e) => setName(e.target.value)}
                            ref={childRef1}
                        />
                        <PlaceholdersAndVanishInput
                            placeholders={urlPlaceholders}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            ref={childRef2}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Summarizing...
                                </>
                            ) : (
                                'Summarize'
                            )}
                        </Button>
                    </form>

                    {videoId && <VideoPlayer videoId={videoId} />}
                    {error && <ErrorDisplay error={error} />}
                </div>
            </div>
        </div>
    );
};