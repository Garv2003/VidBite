import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import axios from "axios";

interface Summary {
    name: string;
    summary: string;
}

export const useSummary = (id: string) => {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["summary", id],
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/summary/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            return response.data;
        }
    });

    const updateMutation = useMutation<Summary, unknown, Summary>({
        mutationFn: async (updatedData) => {
            return axios.put(
                `${import.meta.env.VITE_API_URL}/summary/${id}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
        },
        onSuccess: () => {
            navigate(`/summary/${id}`);
        }
    });

    return {
        summary: data,
        isLoading,
        updateSummary: updateMutation.mutate,
        isUpdating: updateMutation.isPending
    };
};