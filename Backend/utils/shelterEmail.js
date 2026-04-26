import transporter from "../config/nodemailer.js";

export const sendShelterApprovedEmail = async (shelter) => {
  await transporter.sendMail({
    from: `"FureverHome" <${process.env.EMAIL_USER}>`,
    to: shelter.email,
    subject: "🎉 Your Shelter Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">🐾 FureverHome</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827;">Congratulations, ${shelter.organizationName}! 🎉</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Your shelter registration has been <strong style="color: #16a34a;">approved</strong> by our admin team.
            You can now log in to your dashboard and start managing your shelter.
          </p>
          <a href="http://localhost:5173/shelter/login"
            style="display: inline-block; background: #f97316; color: white; padding: 12px 24px;
                   border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            Login to Dashboard →
          </a>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 13px;">
            If you have any questions, reply to this email or contact our support team.
          </p>
        </div>
      </div>
    `,
  });
};

export const sendShelterRejectedEmail = async (shelter, reason) => {
  await transporter.sendMail({
    from: `"FureverHome" <${process.env.EMAIL_USER}>`,
    to: shelter.email,
    subject: "Update on Your Shelter Registration",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">🐾 FureverHome</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827;">Registration Update</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Thank you for registering <strong>${shelter.organizationName}</strong> on FureverHome.
            Unfortunately, your registration has been <strong style="color: #dc2626;">rejected</strong>.
          </p>
          ${reason ? `
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px; margin: 16px 0;">
            <p style="color: #991b1b; margin: 0;"><strong>Reason:</strong> ${reason}</p>
          </div>` : ""}
          <p style="color: #6b7280; line-height: 1.6;">
            You may re-apply after addressing the above issues. If you believe this was a mistake,
            please contact our support team.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 13px;">FureverHome Team</p>
        </div>
      </div>
    `,
  });
};

export const sendNewApplicationEmail = async (shelter, applicant, petName) => {
  await transporter.sendMail({
    from: `"FureverHome" <${process.env.EMAIL_USER}>`,
    to: shelter.email,
    subject: `🐾 New Adoption Application for ${petName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f97316; padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0;">🐾 FureverHome</h1>
        </div>
        <div style="background: #fff; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827;">New Adoption Application 📋</h2>
          <p style="color: #6b7280; line-height: 1.6;">
            Someone has applied to adopt <strong style="color: #f97316;">${petName}</strong> from your shelter!
          </p>
          <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px;"><strong>Applicant:</strong> ${applicant.name}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${applicant.email}</p>
            <p style="margin: 0;"><strong>Phone:</strong> ${applicant.phone || "Not provided"}</p>
          </div>
          <a href="http://localhost:5173/shelter/dashboard/applications"
            style="display: inline-block; background: #f97316; color: white; padding: 12px 24px;
                   border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            View Application →
          </a>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 13px;">FureverHome Team</p>
        </div>
      </div>
    `,
  });
};