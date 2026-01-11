"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface PollFormData {
  title: string;
  avatar?: File | null;
}

export default function AdminPMForm() {
  const [form, setForm] = useState<PollFormData>({
    title: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, avatar: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return toast.error("Please provide a poll title");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);

      if (form.avatar) {
        formData.append("avatar", form.avatar);
      }

      const res = await fetch("/api/approval/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Approval poll created successfully!");

        setForm({
          title: "",
          avatar: null,
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(data.error || "Failed to create poll");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-900/70 backdrop-blur-sm p-6 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create Approval Poll
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Poll Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Prime Minister Approval Rating"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Avatar / Poll Image (optional)</label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600"
            >
              Upload Image
            </button>

            {form.avatar && (
              <span className="text-sm text-gray-300">{form.avatar.name}</span>
            )}
          </div>

          <input
            type="file"
            name="avatar"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Create PM Poll"}
        </button>
      </form>
    </div>
  );
}
