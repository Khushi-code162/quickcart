const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `QuickKart 🛒 <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8" />
          <title>QuickKart Notification</title>
        </head>
        <body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
            <tr>
              <td align="center">

                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);">

                  <!-- Header -->
                  <tr>
                    <td align="center" style="background:#f97316;padding:25px;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;">
                        🛒 QuickKart
                      </h1>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:35px;">
                      <h2 style="margin-top:0;color:#111827;">
                        Hello
                      </h2>

                      <p style="font-size:16px;color:#374151;line-height:1.7;">
                        ${text}
                      </p>

                      <div style="margin:35px 0;text-align:center;">
                        <a href="http://localhost:5173"
                          style="
                            background:#f97316;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 30px;
                            border-radius:6px;
                            font-weight:bold;
                            display:inline-block;
                          ">
                          Visit QuickKart
                        </a>
                      </div>

                      <hr style="border:none;border-top:1px solid #e5e7eb;">

                      <p style="font-size:14px;color:#6b7280;line-height:1.6;">
                        Thank you for shopping with <strong>QuickKart</strong>.
                        <br>
                        If you have any questions, simply reply to this email.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="background:#f9fafb;padding:20px;">
                      <p style="margin:0;font-size:13px;color:#9ca3af;">
                        © 2026 QuickKart. All Rights Reserved.
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;