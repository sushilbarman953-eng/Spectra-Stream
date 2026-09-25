import React from "react";
import clsx from "clsx";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  className?: string;
}

export const GlassButton = ({
  variant = "primary",
  children,
  className,
  ...props
}: GlassButtonProps) => {
  const variants = {
    primary:
      "bg-white text-black font-semibold hover:bg-neutral-200 border border-white/40 shadow-glow",
    secondary:
      "glass-panel text-white hover:bg-white/10 border border-white/15",
    ghost: "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5",
  };

  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
