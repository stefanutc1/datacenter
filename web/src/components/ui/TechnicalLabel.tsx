"use client";

import React from "react";

interface TechnicalLabelProps {
  label: string;
  value?: string | number;
  variant?: "terracotta" | "emerald" | "blue" | "neutral";
  size?: "sm" | "xs";
}

export const TechnicalLabel: React.FC<TechnicalLabelProps> = ({
  label,
  value,
  variant = "neutral",
  size = "xs",
}) => {
  const colorStyles = {
    terracotta: "bg-terracotta-500/10 text-terracotta-600 dark:text-terracotta-400 border-terracotta-500/30",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    neutral: "bg-warm-page text-warm-secondary border-warm",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-mono uppercase tracking-wider ${
        size === "xs" ? "text-[10px]" : "text-xs"
      } ${colorStyles}`}
    >
      <span className="font-semibold">{label}</span>
      {value !== undefined && (
        <>
          <span className="opacity-40">:</span>
          <span className="text-warm-primary font-normal">{value}</span>
        </>
      )}
    </span>
  );
};
