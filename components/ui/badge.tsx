import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";
  const styles =
    variant === "outline"
      ? "border border-white/30 text-white/90"
      : "bg-white/15 text-white border border-white/20";
  return <span className={`${base} ${styles} ${className}`} {...props} />;
}

