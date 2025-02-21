import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSummaries, deleteSummaryById } from "../api/summaries";

export const useSummaries = () => {
    const queryClient = useQueryClient();

    const {
        data: summaries,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["summaries"],
        queryFn: fetchSummaries,
    });

    const deleteMutation = useMutation({
        mutationFn: (summaryId: number) => deleteSummaryById(summaryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["summaries"] });
        },
        onError: (err) => {
            console.error("Error deleting summary:", err);
        },
    });

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    return {
        summaries,
        isLoading,
        error,
        handleDelete,
    };
};
