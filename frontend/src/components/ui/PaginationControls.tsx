import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        className="bg-white border text-black hover:bg-gray-100 w-3 h-9"
        disabled={page === 1}
        onClick={onPrev}
      >
        <ChevronLeft className="w-3 h-3" />
      </Button>
      <span className="font-lazare text-xs">
        {page} of {totalPages}
      </span>
      <Button
        className="bg-white border text-black hover:bg-gray-100 w-3 h-9"
        disabled={page >= totalPages}
        onClick={onNext}
      >
        <ChevronRight className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default PaginationControls;
