"use client";

import { useEffect } from "react";
import { createSystemErrorLog } from "@/lib/firebase/firestore";

export function ErrorTrackerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const msg = event.message || "";
      if (
        msg.includes("permission-denied font-sans") ||
        msg.includes("insufficient permissions") ||
        msg.includes("Missing or insufficient permissions")
      ) {
        return;
      }

      createSystemErrorLog({
        message: msg || "Global Unhandled Error",
        stack: event.error?.stack || `${event.filename}:${event.lineno}:${event.colno}`,
        url: window.location.href,
        context: "Global Unhandled Error",
      }).catch(() => {});
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string"
          ? reason
          : reason?.message || "Unhandled Promise Rejection";

      if (
        message.includes("permission-denied") ||
        message.includes("insufficient permissions") ||
        message.includes("Missing or insufficient permissions") ||
        reason?.code === "permission-denied"
      ) {
        return;
      }

      const stack = reason?.stack || "";

      createSystemErrorLog({
        message,
        stack,
        url: window.location.href,
        context: "Unhandled Promise Rejection",
      }).catch(() => {});
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
