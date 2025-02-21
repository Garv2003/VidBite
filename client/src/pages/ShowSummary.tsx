import { useParams } from "react-router";
import { Navbar } from "@/layouts/Navbar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useSummaryData } from "@/hooks/useSummaryData";
import { useSummaryActions } from "@/hooks/useSummaryActions";
import { LoadingState } from "@/components/custom/LoadingState";
import { ErrorState } from "@/components/custom/ErrorState";
import { VideoPlayer } from "@/components/custom/VideoPlayer";

export const ShowSummary = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useSummaryData(id!);
    const { handleEdit, handleDelete, isDeleting } = useSummaryActions();

    if (isLoading) {
        return (
            <>
                <Navbar />
                <LoadingState />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <ErrorState error={error} />
            </>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Navbar />
            <div className="min-h-screen p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold text-white mb-4">
                            {data?.name || 'Video Summary'}
                        </h1>

                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(data!.id)}
                                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(data!.id)}
                                disabled={isDeleting}
                                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
                            >
                                <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                            </Button>
                        </div>
                    </div>

                    <VideoPlayer videoId={data!.video_id} />

                    <div
                        dangerouslySetInnerHTML={{ __html: data?.formattedSummary || '' }}
                        className="w-full p-6 border rounded-lg shadow-sm text-white overflow-auto prose prose-invert max-w-none"
                    />
                </div>
            </div>
        </div>
    );
};