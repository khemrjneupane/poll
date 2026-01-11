"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import NominatedVoted from "./NominatedVoted";

export default function Profile() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [name, setName] = useState(user?.name || "");
  const [surname, setSurname] = useState(user?.surname || "");
  //const [email, setEmail] = useState(user?.email || "");
  const email = user?.email || "Email cannot be edited";
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Please login to view profile.</p>
      </div>
    );
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    //formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);

    const res = await fetch("/api/auth/update", {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      await update();
      toast.success(`Profile updated successfully`);
    } else {
      toast.error(data.message || "Update failed");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error(`Passwords do not match`);
      return;
    }

    const res = await fetch("/api/auth/update_password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success(`Password updated successfully`);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(data.message || "Password update failed");
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) {
      setAvatar(null);
      setPreview(null);
      return;
    }
    setAvatar(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-slate-900/80">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6 flex items-center gap-6">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={120}
            height={120}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : session.user.image ? (
          <Image
            src={session.user.image || ""}
            alt={session.user.name || "User"}
            width={120}
            height={120}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="w-24 h-24 text-gray-400" />
        )}
        <div>
          <h2 className="text-lg font-semibold">{`${user.name && user.name} ${
            user.surname && user.surname
          }`}</h2>
          <p className="text-gray-600">{user.email}</p>
          <span className="text-sm px-2 py-1 bg-gray-100 rounded-md">
            {user.role || "user"}
          </span>
        </div>
      </div>
      <div>
        <NominatedVoted />
      </div>

      {/* Profile Update Form */}
      <form
        onSubmit={handleProfileUpdate}
        className="bg-white shadow-md rounded-2xl p-6 mb-6"
      >
        <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Firstname</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={name}
            placeholder="Enter your first name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Surname</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={surname}
            placeholder="Enter your surname"
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="text"
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={email}
            placeholder={email}
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Avatar</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full"
            onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
          />
          {preview && (
            <div className="mt-3">
              <Image
                src={preview}
                alt="Selected"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover border"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Save Changes
        </button>
      </form>

      {/* Password Update Form */}
      {session?.user?.provider !== "google" && (
        <form
          onSubmit={handlePasswordUpdate}
          className="bg-white shadow-md rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Current Password
            </label>
            <input
              type="password"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">New Password</label>
            <input
              type="password"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              className="mt-1 w-full border rounded-lg px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
