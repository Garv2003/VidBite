import axios from "axios";

export const fetchSummaries = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/summary`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteSummaryById = async (summaryId: number) => {
    const token = localStorage.getItem("token");
    await axios.delete(`${import.meta.env.VITE_API_URL}/summary/${summaryId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};