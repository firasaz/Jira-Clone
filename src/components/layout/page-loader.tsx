import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface PageLoaderProps {
  className?: string;
  loaderClassName?: string;
}
export const PageLoader = ({ className, loaderClassName }: PageLoaderProps) => {
  return (
    <div className={cn("flex justify-center items-center h-full", className)}>
      <Loader
        className={cn(
          "size-6 animate-spin text-muted-foreground",
          loaderClassName
        )}
      />
    </div>
  );
};
