import { ArrowUpRight } from "lucide-react";
import Skeleton from "react-loading-skeleton";

const DashboardCard = ({
  title,
  count,
  lastWeekCount,
  isLoading
}: {
  title: string;
  count: number | string;
  lastWeekCount: number;
  isLoading: boolean;
}) => (
  <div
    key={title}
    className="rounded-xl bg-white border p-5 pt-4 shadow-sm transition-all duration-300">
    <div className="flex justify-between">
      <p className="font-cantarell md:text-[15px] text-[12px] text-gray-400 ">{title}</p>
      <ArrowUpRight className="text-green-600 md:w-4 w-4" />
    </div>
    <p className="text-2xl my-1 font-cantarell md:text-[21px] text-[16px] dark:text-black font-semibold">
      {isLoading ? <Skeleton className="h-7 w-48" /> : count}
    </p>
    <p className="font-cantarell text-gray-400 md:text-[15px] text-[12px]">
      {isLoading ? (
        <Skeleton className="h-7 w-48" />
      ) : (
        `+${lastWeekCount} this week`
      )}
    </p>
  </div>
);

export default DashboardCard;
