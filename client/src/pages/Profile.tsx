import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Edit, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router";

export const Profile = () => {
    const user = {
        name: "John Doe",
        email: "john@example.com",
        avatarUrl: "/api/placeholder/150/150",
        stats: {
            savedSummaries: 42,
            totalVideosProcessed: 56,
            averageLength: "5 min"
        }
    };

    const videoSummaries = [
        {
            id: 1,
            title: "Understanding React Hooks",
            thumbnailUrl: "/api/placeholder/320/180",
            videoUrl: "https://youtube.com/watch?v=123",
            createdAt: "2025-02-15T10:30:00Z",
            summary: "A comprehensive guide to React Hooks including useState, useEffect..."
        },
        {
            id: 2,
            title: "Advanced TypeScript Patterns",
            thumbnailUrl: "/api/placeholder/320/180",
            videoUrl: "https://youtube.com/watch?v=456",
            createdAt: "2025-02-14T15:45:00Z",
            summary: "Deep dive into TypeScript patterns and best practices..."
        }
    ];

    const handleEdit = (id: number) => {
        console.log('Edit summary:', id);
    };

    const handleDelete = (id: number) => {
        console.log('Delete summary:', id);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header with Avatar */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-black dark:text-white">
                    <Link to="/">VidBite</Link>
                </h1>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-medium text-black dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-800">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black dark:text-white">
                            Saved Summaries
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black dark:text-white">
                            {user.stats.savedSummaries}
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
                            {user.stats.totalVideosProcessed}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Videos processed with LLMs
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-black dark:text-white">
                            Average Summary
                        </CardTitle>
                        <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-black dark:text-white">
                            {user.stats.averageLength}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Average summary length
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Video Summaries Section */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="text-black dark:text-white">Video Summaries</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {videoSummaries.map((video) => (
                            <div
                                key={video.id}
                                className="flex gap-4 p-4 border rounded-lg"
                            >
                                {/* hover:bg-gray-50 dark:hover:bg-zinc-900  */}
                                {/* Thumbnail */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={video.thumbnailUrl}
                                        alt={video.title}
                                        className="w-40 h-24 object-cover rounded-md"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-lg text-black dark:text-white">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Created on {formatDate(video.createdAt)}
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
                                                onClick={() => window.open(video.videoUrl, '_blank')}
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