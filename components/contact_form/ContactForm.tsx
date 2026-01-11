"use client";

import { useState } from "react";

export default function ContactForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("");
      } else {
        setStatus("error");
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setStatus("error");
      setError("Network error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 pt-20">
      <form
        onSubmit={handleSubmit}
        className="w-full mx-auto bg-white dark:bg-gray-900 shadow-md rounded-2xl p-6 space-y-14 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Contact Admin
        </h2>

        <textarea
          name="message"
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none"
          required
        />

        <button
          type="submit"
          disabled={status === "loading"}
          className=" bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-lg transition-all duration-200"
        >
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>

        {status === "success" && (
          <p className="text-green-600 text-center font-medium">
            ✅ Message sent successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500 text-center font-medium">❌ {error}</p>
        )}
      </form>
    </div>
  );
}
