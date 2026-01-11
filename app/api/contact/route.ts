import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/backend/lib/auth";
import transport from "@/backend/lib/sendNodeMailer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { message } = await req.json();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!message || message.trim() === "") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const userEmail = session.user.email;
    const userName = session.user.name || "Anonymous";

    // Send the message to your admin inbox
    await transport.sendMail({
      from: userEmail,
      to: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      subject: `📩 New contact message from ${userName}`,
      html: `
        <div style="font-family:sans-serif; padding:16px; line-height:1.6;">
          <h2 style="color:#2563eb;">New Contact Form Message</h2>
          <p><strong>Sender Name:</strong> ${userName}</p>
          <p><strong>Sender Email:</strong> ${userEmail}</p>
          <p><strong>Message:</strong></p>
          <div style="background:#f3f4f6; padding:12px; border-radius:8px;">
            ${message}
          </div>
        </div>
      `,
    });

    // Optional: send confirmation to user
    await transport.sendMail({
      from: process.env.NODE_CODE_SENDING_EMAIL_ADDRESS,
      to: userEmail,
      subject: `✅ Your message has been received`,
      html: `
        <div style="font-family:sans-serif; padding:16px;">
          <p>Hi ${userName},</p>
          <p>We’ve received your message:</p>
          <blockquote style="border-left:4px solid #22c55e; padding-left:12px; color:#374151;">
            ${message}
          </blockquote>
          <p>We'll get back to you soon.</p>
          <p>— The Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { error: "Failed to send email." },
      { status: 500 }
    );
  }
}
