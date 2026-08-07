"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";

interface ReviewCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  colorClass?: string;
  index?: number;
}

export function ReviewCard({
  icon,
  title,
  children,
  colorClass = "from-primary/10 to-primary/5",
  index = 0,
}: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br p-[1px] transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className={`h-full rounded-[11px] bg-gradient-to-br ${colorClass} p-4 backdrop-blur-sm`}
      >
        {/* Header */}
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/80 text-sm shadow-sm ring-1 ring-border/30 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <h4 className="text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h4>
        </div>

        {/* Content */}
        <div className="text-[13px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
