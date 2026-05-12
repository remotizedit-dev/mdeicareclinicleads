"use server";

import nodemailer from "nodemailer";

export async function sendLeadEmail(formData: Record<string, any>) {
  // If the credentials are not configured, skip sending to avoid breaking the form
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Gmail credentials not set! Skipping email notification.");
    return { success: false, error: "Credentials missing" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const formText = Object.entries(formData)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const formHtml = Object.entries(formData)
      .map(([key, value]) => `<li style="margin-bottom: 8px;"><strong>${key}:</strong> ${value}</li>`)
      .join("");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECEIVER_EMAIL?.split(",") || process.env.GMAIL_USER, // Sends to specific email or defaults to sender
      subject: "New Online Appointment Request - Medicare Clinic",
      text: `You have received a new online appointment request:\n\n${formText}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #039855;">New Online Appointment Request</h2>
          <p>You have received a new appointment request from the website.</p>
          <ul style="list-style-type: none; padding: 0;">
            ${formHtml}
          </ul>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">This is an automated notification from your online appointment management. </br>Developed by Dexcel</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}
