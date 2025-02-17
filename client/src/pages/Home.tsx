import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function Home() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["summarize", "video", "transcript", "with", "AI"],
        []
    );

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (titleNumber === titles.length - 1) {
                setTitleNumber(0);
            } else {
                setTitleNumber(titleNumber + 1);
            }
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [titleNumber, titles]);

    return (
        <div className="w-full">
            <div className="container mx-auto">
                <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
                    <div>
                        <Link to="/register">
                            <Button variant="secondary" size="sm" className="gap-4">
                                Start now <MoveRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex gap-4 flex-col">
                        <h1 className="text-5xl md:text-7xl max-w-5xl  tracking-tighter text-center font-regular">
                            <span className="text-spektr-cyan-50">VidBite - Your Video Summarizer</span>
                            <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                                &nbsp;
                                {titles.map((title, index) => (
                                    <motion.span
                                        key={index}
                                        className="absolute font-semibold"
                                        initial={{ opacity: 0, y: "-100" }}
                                        transition={{ type: "spring", stiffness: 50 }}
                                        animate={
                                            titleNumber === index
                                                ? {
                                                    y: 0,
                                                    opacity: 1,
                                                }
                                                : {
                                                    y: titleNumber > index ? -150 : 150,
                                                    opacity: 0,
                                                }
                                        }
                                    >
                                        {title}
                                    </motion.span>
                                ))}
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-5xl text-center">
                            Effortless Video Summarization with AI
                            Save time and stay informed with VidBite! Our AI-powered tool quickly summarizes any video, extracting key points so you can get the gist in seconds. Whether it’s for work, study, or just staying up-to-date, VidBite makes video content easier to digest. Try it today and let AI do the work for you!
                        </p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <Link to="/login">
                            <Button size="lg" className="gap-4">
                                Login <MoveRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

