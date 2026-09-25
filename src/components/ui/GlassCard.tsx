import React from "react";
import clsx from "clsx";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard = ({
  children,
  className,
  hoverEffect = false,
  ...props
}: GlassCardProps) => {
  return (
    <div
      className={clsx(
        "glass-panel rounded-2xl shadow-glass",
        hoverEffect && "glass-panel-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
