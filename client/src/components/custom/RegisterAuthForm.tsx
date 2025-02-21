import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";
import { toast } from "sonner"

const apiRegisterSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

type APIRegisterData = Omit<z.infer<typeof apiRegisterSchema>, "confirmPassword">;

const ApiRegister = async (data: APIRegisterData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/register`, data, {
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.data;
};

export function RegisterAuthForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(apiRegisterSchema),
    });

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: ApiRegister,
        onSuccess: () => {
            toast.success("Registered")
            navigate("/login")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const onSubmit = (data: z.infer<typeof apiRegisterSchema>) => {
        mutate({
            name: data.name,
            email: data.email,
            password: data.password,
        });
    };

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4">
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" disabled={isPending} {...register("name")} />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="email">Email</Label>
                        <Input id="email" placeholder="name@example.com" disabled={isPending} {...register("email")} />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Your password" disabled={isPending} {...register("password")} />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="grid gap-1">
                        <Label className="sr-only" htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm your password" disabled={isPending} {...register("confirmPassword")} />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} Create an account
                    </Button>
                </div>
            </form>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>
            <Button variant="outline" type="button" disabled={isPending}>
                {isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.gitHub className="mr-2 h-4 w-4" />} GitHub
            </Button>
        </div>
    );
}
