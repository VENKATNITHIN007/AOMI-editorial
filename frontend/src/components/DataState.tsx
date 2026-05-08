import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import { AlertCircle, RefreshCcw, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Loading State Component.
 * Minimalist spinner centered in a container.
 */
function Loading({ className }: { className?: string }) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center space-y-4", className)}>
      <Spinner size="md" className="text-black" />
      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold animate-pulse">Loading Studio Data</p>
    </div>
  );
}

/**
 * Error State Component.
 * Clean, non-intrusive error display with a retry action.
 */
interface ErrorProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  actionLabel?: string;
}

function ErrorState({ message = "An error occurred", onRetry, className, actionLabel = "Try Again" }: ErrorProps) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center text-center px-6 border border-dashed border-red-100 bg-red-50/30 rounded-none", className)}>
      <AlertCircle className="size-8 text-red-200 mb-6" />
      <h3 className="text-[11px] uppercase tracking-[0.2em] font-black text-red-900 mb-2">System Notice</h3>
      <p className="text-sm text-red-800/60 max-w-xs mb-8 leading-relaxed font-light">{message}</p>
      
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="h-12 px-8 border-red-200 text-[10px] uppercase tracking-widest font-bold text-red-900 hover:bg-red-900 hover:text-white hover:border-red-900 transition-all rounded-none"
        >
          <RefreshCcw className="size-3 mr-3" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Empty State Component.
 * Editorial design for empty lists/results.
 */
interface EmptyProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

function Empty({ title, description, action, icon, className }: EmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-none border border-dashed border-gray-200 bg-gray-50/30 px-6 py-24 text-center", className)}>
      <div className="mb-8 text-gray-200">
        {icon || <Layout className="size-10" />}
      </div>
      <h3 className="text-xs uppercase tracking-[0.3em] font-black text-black mb-3">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm mb-10 leading-relaxed font-light">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export const DataState = {
  Loading,
  Error: ErrorState,
  Empty,
};
