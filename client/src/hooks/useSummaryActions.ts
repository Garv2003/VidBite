import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const deleteSummaryById = async (summaryId: number) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${import.meta.env.VITE_API_URL}/summary/${summaryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const useSummaryActions = () => {
    const navigate = useNavigate();

    const deleteMutation = useMutation({
        mutationFn: (summaryId: number) => deleteSummaryById(summaryId),
        onSuccess: () => {
            navigate("/summary");
        },
        onError: (err) => {
            console.error("Error deleting summary:", err);
        },
    });

    const handleEdit = (id: number) => {
        navigate(`/edit-summary/${id}`);
    };

    const handleDelete = (id: number) => {
        deleteMutation.mutate(id);
    };

    return {
        handleEdit,
        handleDelete,
        isDeleting: deleteMutation.isPending
    };
};
