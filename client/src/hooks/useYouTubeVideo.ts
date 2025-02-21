import { useState } from 'react';
import { useNavigate } from 'react-router';

interface UseYouTubeVideoProps {
    onError: (error: string) => void;
}

export const useYouTubeVideo = ({ onError }: UseYouTubeVideoProps) => {
    const [url, setUrl] = useState('');
    const [videoId, setVideoId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const extractVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match?.[1] || '';
    };

    const handleUrlChange = (value: string) => {
        setUrl(value);
        const newVideoId = extractVideoId(value);
        setVideoId(newVideoId);
    };

    const submitSummaryRequest = async (name: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/summarize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ video_url: url, name }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            navigate(`/summary/${data.id}`);
        } catch (err: any) {
            onError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        url,
        videoId,
        isLoading,
        handleUrlChange,
        submitSummaryRequest
    };
};
