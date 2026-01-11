"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Toaster, ToastBar } from "react-hot-toast";

export function GlobalProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster
        containerStyle={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90vw",
          maxWidth: "800px",
          height: "40vh",
          minHeight: "300px",
          zIndex: 9999,
        }}
        toastOptions={{
          style: {
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            fontSize: "1.5rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
          },
          success: {
            style: {
              background: "rgba(34, 197, 94, 0.1)",
              border: "3px solid rgba(34, 197, 94, 0.5)",
              color: "#166534",
            },
            iconTheme: {
              primary: "#16a34a",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "rgba(239, 68, 68, 0.1)",
              border: "3px solid rgba(239, 68, 68, 0.5)",
              color: "#dc2626",
            },
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff",
            },
          },
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              width: "100%",
              height: "100%",
              animation: t.visible
                ? "custom-enter 0.5s ease-out"
                : "custom-exit 0.5s ease-in forwards",
            }}
          >
            {({ icon, message }) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  width: "100%",
                  height: "100%",
                }}
              >
                <div style={{ fontSize: "3rem" }}>{icon}</div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    lineHeight: "1.4",
                  }}
                >
                  {message}
                </div>
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
