import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Navbar } from "@/layouts/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSummary } from "@/hooks/useSummary";
import { useMarkdownPreview } from "@/hooks/useMarkdownPreview";

export const EditSummary = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");

    const { summary: summaryData, isLoading, updateSummary, isUpdating } = useSummary(id!);
    const previewHtml = useMarkdownPreview(summary);

    useEffect(() => {
        if (summaryData) {
            setTitle(summaryData.name || "");
            setSummary(summaryData.summary || "");
        }
    }, [summaryData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSummary({
            name: title,
            summary: summary
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900">
                <Navbar />
                <div className="container mx-auto py-8">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container h-[calc(100vh-64px)] mx-auto p-6">
            <Navbar />
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
                <div className="flex items-center justify-between gap-6">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Summary Title"
                        className="text-lg text-white"
                    />
                    <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-white">
                            Edit Summary
                        </h2>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="w-full h-[calc(100vh-220px)] p-4 border rounded-lg text-white resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-white">Preview</h2>
                        <div
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                            className="w-full h-[calc(100vh-220px)] p-4 border rounded-lg text-white overflow-auto prose prose-invert max-w-none"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};