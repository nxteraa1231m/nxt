"use client";

import { useEffect } from "react";
import { createSystemErrorLog } from "@/lib/firebase/firestore";

export function ErrorTrackerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      createSystemErrorLog({
        message: event.message || "Global Unhandled Error",
        stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
        url: window.location.href,
        context: "Global Unhandled Error",
      }).catch(console.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason?.message || "Unhandled Promise Rejection";
      const stack = reason?.stack || "";

      createSystemErrorLog({
        message,
        stack,
        url: window.location.href,
        context: "Unhandled Promise Rejection",
      }).catch(console.error);
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}
