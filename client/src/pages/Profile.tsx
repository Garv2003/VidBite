import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash2, ExternalLink, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { Navbar } from "@/layouts/Navbar";
import { useSummaries } from "../hooks/useSummaries";
import { useFormatDate } from "../hooks/useFormatDate";

export const Profile = () => {
    const { user: currentUser } = useAuthStore();
    const navigate = useNavigate();
    const { summaries, isLoading, error, handleDelete } = useSummaries();
    const { formatDate } = useFormatDate();

    const handleEdit = (id: number) => {
        navigate(`/edit-summary/${id}`);
    };

    const handleCreateSummary = () => {
        navigate("/summary");
    };

    if (isLoading) return <p>Loading summaries...</p>;
    if (error) return <p>Error loading summaries: {error.message}</p>;

    return (
        <div className="container mx-auto p-6">
            <Navbar />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black dark:text-white">
                            Saved Summaries
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black dark:text-white">
                            {summaries?.length}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Video summaries saved
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black dark:text-white">
                            Total Videos
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black dark:text-white">
                            {currentUser?.stats.totalVideosProcessed}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Videos processed with LLMs
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-black dark:text-white">Video Summaries</CardTitle>
                    <Button variant="outline" onClick={handleCreateSummary}>
                        <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />Create Summary
                    </Button>
                </CardHeader>
                <CardContent>
                    {summaries.length === 0 && (
                        <p className="text-gray-500">No summaries found.</p>
                    )}
                    <div className="space-y-6">
                        {summaries.map((video: { id: number, name: string, created_at: string, updatedAt: string, userId: number, thumbnail: string, summary: string, video_url: string, video_id: string }) => (
                            <div
                                key={video.id}
                                className="flex gap-4 p-4 border rounded-lg"
                            >
                                <Link to={`/summary/${video.id}`} className="flex-shrink-0">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.name}
                                            className="w-40 h-24 object-cover rounded-md"
                                        />
                                    </div>
                                </Link>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-lg text-black dark:text-white">
                                                {video.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Created on {formatDate(video.created_at)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(video.id)}
                                                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                                            >
                                                <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(video.id)}
                                                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => window.open(video.video_url, '_blank')}
                                                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                                            >
                                                <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                        {video.summary}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};