"use client";

import React from "react";

interface StatusIndicatorProps {
  status: "online" | "standby" | "alert" | "maintenance" | "offline";
  label?: string;
  size?: "sm" | "md";
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = "sm",
}) => {
  const dotColor = {
    online: "bg-emerald-500",
    standby: "bg-amber-500",
    alert: "bg-rose-500",
    maintenance: "bg-blue-500",
    offline: "bg-neutral-500",
  }[status];

  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs">
      <span className="relative flex h-2 w-2">
        {status === "online" && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
      </span>
      {label && <span className="text-warm-secondary uppercase">{label}</span>}
    </div>
  );
};
