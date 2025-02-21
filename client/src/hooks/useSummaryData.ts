import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import showdown from "showdown";

interface SummaryData {
    id: number;
    name: string;
    video_id: string;
    summary: string;
    formattedSummary?: string;
}

export const useSummaryData = (id: string) => {
    return useQuery({
        queryKey: ['summary', id],
        queryFn: async (): Promise<SummaryData> => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/summary/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.summary) {
                const converter = new showdown.Converter();
                const html = converter.makeHtml(response.data.summary);
                return {
                    ...response.data,
                    formattedSummary: html
                };
            }
            return response.data;
        }
    });
};
