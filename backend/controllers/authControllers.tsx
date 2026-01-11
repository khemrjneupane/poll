import { NextRequest, NextResponse } from "next/server";
import User from "../models/user";
import dbConnect from "../config/dbConnect";
import { deleteFile, uploadFile } from "../lib/cloudinary";
import { authOptions } from "../lib/auth";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import transport from "../lib/sendNodeMailer";
import crypto from "crypto";
// Register user  =>  /api/auth/register
export const registerUser = async (req: NextRequest) => {
  try {
    await dbConnect();

    // Parse multipart form-data (frontend is sending FormData)
    const form = await req.formData();
    const name = (form.get("name") as string) || "";
    const surname = (form.get("surname") as string) || "";
    const email = (form.get("email") as string) || "";
    const password = (form.get("password") as string) || "";
    const avatarFile = form.get("avatar") as File | null;

    // Basic validation
    if (!name || !surname || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for existing user (by email)
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Handle avatar upload (convert File -> dataURL, same approach as updateUser)
    let avatarData: { public_id: string; url: string } | undefined = undefined;
    if (avatarFile && avatarFile.size > 0) {
      const arrayBuffer = await avatarFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:${avatarFile.type};base64,${base64}`;

      const uploaded = await uploadFile(dataUrl, "avatars");
      avatarData = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
    }

    // Create user - do NOT hash the password here (schema pre-save handles hashing)
    const created = await User.create({
      name,
      surname,
      email,
      password, // plain text here; the userSchema pre('save') hook will hash it
      avatar: avatarData,
      role: "user",
    });

    // Return user without password field
    const safeUser = await User.findById(created._id).select("-password");

    return NextResponse.json(
      { success: true, user: safeUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Registration error:", error);

    // Duplicate key (email) guard — sometimes thrown as MongoError with code 11000
    if (error === 11000) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: (error as Error).message || "Server error" },
      { status: 500 }
    );
  }
};
/*
export const registerUser = async (req: NextRequest) => {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, surname, email, password, avatar } = body;

    if (!name || !surname || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let avatarData = undefined;

    if (avatar) {
      // avatar can be base64 string or remote URL
      const uploaded = await uploadFile(avatar, "avatars");
      avatarData = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
    }

    await User.create({
      name,
      surname,
      email,
      password,
      avatar: avatarData,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};
*/

// Update user profile => /api/auth/update
export const updateUser = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Use FormData since frontend sends avatar
    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const surname = formData.get("surname") as string | null;
    const avatarFile = formData.get("avatar") as File | null;

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (surname) updateData.surname = surname;

    // Handle avatar replacement
    if (avatarFile && avatarFile.size > 0) {
      // Delete old avatar if exists
      if (user.avatar?.public_id) {
        await deleteFile(user.avatar.public_id);
      }

      // Convert File to Base64 string for Cloudinary
      const arrayBuffer = await avatarFile.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:${avatarFile.type};base64,${base64}`;

      const uploaded = await uploadFile(dataUrl, "avatars");
      updateData.avatar = {
        public_id: uploaded.public_id,
        url: uploaded.url,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { new: true }
    ).select("-password");

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Profile update error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};

// Update user profile => /api/auth/update_password
export const updatePassword = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only credentials users can update password
    if (session.user.provider && session.user.provider !== "credentials") {
      return NextResponse.json(
        {
          success: false,
          message: "Password update not allowed for OAuth users",
        },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Both current and new password are required",
        },
        { status: 400 }
      );
    }

    const user = await User.findById(session.user.id).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("❌ Password update error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};

//Reset password
export const forgotPassword = async (req: NextRequest) => {
  try {
    await dbConnect();

    const formData = await req.formData();
    const email = formData.get("email") as string;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "This email is not registered" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token + expiry in DB
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15; // 15 min expiry
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

    // Send email
    await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the link below:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: `Password reset link sent to: ${user.email}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Forgot Password Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};
//Reset password
export const resetPassword = async (req: NextRequest, token: string) => {
  try {
    await dbConnect();

    const formData = await req.formData();
    const newPassword = formData.get("newPassword") as string;

    if (!newPassword) {
      return NextResponse.json(
        { success: false, message: "New password is required" },
        { status: 400 }
      );
    }

    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    user.password = newPassword; // hashed in pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return NextResponse.json(
      { success: true, message: "Password reset successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
};
