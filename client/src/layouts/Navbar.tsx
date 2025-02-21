import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { Link } from "react-router";

export const Navbar = () => {
    const { user: currentUser } = useAuthStore();
    return (
        <nav className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-black dark:text-white">
                <Link to="/">VidBite</Link>
            </h1>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="font-medium text-black dark:text-white">{currentUser?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentUser?.email}</p>
                </div>
                <Link to="/profile">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-800">
                            {currentUser?.name?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                </Link>
            </div>
        </nav>
    );
};
