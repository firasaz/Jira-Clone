import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

export const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="flex justify-center items-center gap-x-2 lg:justify-start mb-4 w-full lg:w-auto">
      <Button
        onClick={() => onNavigate("PREV")}
        variant={"secondary"}
        size={"icon"}
        className="flex items-center"
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex justify-center items-center gap-x-2 border border-input rounded-md px-3 py-2 h-8 w-full lg:w-auto">
        <CalendarIcon className="size-4" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>
      <Button
        onClick={() => onNavigate("NEXT")}
        variant={"secondary"}
        size={"icon"}
        className="flex items-center"
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};
