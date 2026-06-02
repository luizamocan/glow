const nodemailer = require("nodemailer");

const getTransport = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASS are required to send recovery emails");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

const sendPasswordResetEmail = async ({ to, token }) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const appName = "Glow & Shine";
  const transport = getTransport();

  await transport.sendMail({
    from,
    to,
    subject: `${appName} password recovery`,
    text: [
      "You requested a password reset for your Glow & Shine account.",
      "",
      `Reset code: ${token}`,
      "",
      "This code expires in 15 minutes.",
      "If you did not request this, you can ignore this email.",
    ].join("\n"),
    html: `
      <p>You requested a password reset for your Glow &amp; Shine account.</p>
      <p><strong>Reset code:</strong> <code>${token}</code></p>
      <p>This code expires in 15 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
