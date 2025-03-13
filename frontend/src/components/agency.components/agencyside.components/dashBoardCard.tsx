import { ArrowUpRight } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const DashboardCard = ({ title, count, lastWeekCount, isLoading }: { title: string, count: number | string, lastWeekCount: number, isLoading: boolean }) => (
    <div key={title} className="lg:w-[17.9rem] w-[20rem] min-h-[5rem] rounded-xl bg-white p-5 pt-4 hover:shadow-md cursor-pointer transition-all duration-300">
        <div className="flex justify-between">
            <p className="font-cantarell text-gray-400 ">{title}</p>
            <ArrowUpRight className="w-4 text-green-600" />
        </div>
        <p className="text-2xl my-1 font-cantarell dark:text-black font-semibold">
            {isLoading ? <Skeleton className="h-7 w-48" /> : count}
        </p>
        <p className="font-cantarell text-gray-400">
            {isLoading ? <Skeleton className="h-7 w-48" /> : `+${lastWeekCount} this week`}
        </p>
    </div>
);


export default DashboardCard
