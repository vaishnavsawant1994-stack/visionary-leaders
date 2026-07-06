"use client";

import React, { forwardRef } from "react";

interface FlipPageProps {
  children: React.ReactNode;
  className?: string;
}

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {children}
      </div>
    );
  }
);

FlipPage.displayName = "FlipPage";

export default FlipPage;