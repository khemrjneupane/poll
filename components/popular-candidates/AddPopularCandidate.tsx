"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  userRole: string;
}

export default function AddPopularCandidate({ userRole }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    age: "",
    group: "party",
    category: "",
    party: "",
    province: "",
    avatar: null as File | null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (userRole !== "admin") return <p>Only admin can add candidates.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("surname", formData.surname);
    data.append("age", formData.age);
    data.append("group", formData.group);
    data.append("category", formData.category);
    data.append("province", formData.province);
    if (formData.group === "party") data.append("party", formData.party);
    if (formData.avatar) data.append("avatar", formData.avatar);

    try {
      const res = await fetch("/api/popular-candidate", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (res.ok) {
        //setMessage("Candidate added successfully!");
        toast.success("Candidate added successfully!");
        setFormData({
          name: "",
          surname: "",
          age: "",
          group: "party",
          category: "",
          party: "",
          province: "",
          avatar: null,
        });
      } else {
        //setMessage(result.error || "Failed to add candidate");
        toast.error(result.message || "Failed to add candidate");
      }
    } catch (err) {
      console.error(err);
      //setMessage("Something went wrong!");
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-101 text-slate-50">
      <form onSubmit={handleSubmit} className="p-4 border rounded space-y-6">
        <h2 className="text-lg font-semibold">
          Who would you like to see as next PM
        </h2>
        <input
          type="text"
          name="name"
          placeholder="First Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formData.surname}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <select
          name="group"
          value={formData.group}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="party">Party</option>
          <option value="independent">Independent</option>
        </select>
        <input
          type="text"
          name="category"
          placeholder="PM, minister,member, independent, category ...?"
          value={formData.category}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        {formData.group === "party" && (
          <input
            type="text"
            name="party"
            placeholder="Party Name"
            value={formData.party}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        )}
        <input
          type="text"
          name="province"
          placeholder="Province"
          value={formData.province}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
        <input type="file" name="avatar" onChange={handleFileChange} />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          {loading ? "Adding..." : "Add Next PM"}
        </button>
        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
}
