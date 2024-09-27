import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import Link from "next/link";

const Marketing = () => {
    return (
        <div className="flex items-center justify-center flex-col h-screen w-screen bg-gray-100">
            <div className="flex items-center justify-center flex-col w-full h-full p-4">
                <div className="mb-4 flex items-center justify-center border shadow-sm p-4 bg-amber-500 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2" />
                    No 1 task management
                </div>
                <div>
                    <h1 className="text-4xl md:text-7xl text-center mb-6 w-fit">
                        ARRENGE TASKS
                    </h1>
                </div>

                <div className="text-4xl md:text-7xl text-center bg-gradient-to-r from-slate-600 to-black text-white px-4 py-2 rounded-md w-fit">
                    Work forward
                </div>
                <div className="text-sm md:text-xl text-neutral-500 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
                    Collaborating and making tasks possible through scheduling
                </div>
                <Button className="mt-6" size="lg">
                    <Link href="/register">
                        Get started now
                    </Link>
                </Button>
            </div>
        </div>
    );
};

export default Marketing;
