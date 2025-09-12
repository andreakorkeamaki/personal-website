import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({ variant = "default", size = "md", className = "", ...props }: ButtonProps) {
  const variantCls =
    variant === "ghost"
      ? "bg-transparent hover:bg-white/10 border border-white/15"
      : variant === "outline"
      ? "bg-transparent border border-white/20 hover:bg-white/10"
      : "bg-white/15 hover:bg-white/25 border border-white/20";
  const sizeCls = size === "sm" ? "px-3 py-1.5 text-sm" : size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2 text-sm";
  return (
    <button
      className={`rounded-lg transition-colors ${variantCls} ${sizeCls} ${className}`}
      {...props}
    />
  );
}

