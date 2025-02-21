import ReactPlayer from 'react-player/youtube';

interface VideoPlayerProps {
    videoId: string;
}

export const VideoPlayer = ({ videoId }: VideoPlayerProps) => (
    <div className="mt-6 w-full flex justify-center items-center">
        <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            width="100%"
            height="480px"
            controls />
    </div>
);
