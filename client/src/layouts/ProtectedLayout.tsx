import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";
import { Icons } from "@/components/ui/icons";
import axios from "axios";

export const ProtectedLayout = () => {
    const navigate = useNavigate();
    const { setUser } = useAuthStore();

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const authenticateUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.data);
            } catch (error) {
                console.error("Authentication failed:", error);
                localStorage.removeItem("access_token");
                navigate("/login");
            }
            finally {
                setIsLoading(false);
            }
        };
        authenticateUser();
    }, []);

    if (isLoading) {
        return <div className="h-screen flex flex-col items-center justify-center">
            <Icons.spinner className="mr-2 size-10 animate-spin" />
        </div>;
    }

    return <Outlet />;
};
