import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "True Feedback verification code",
      react: VerificationEmail({ username, verificationCode }),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (error) {
    console.log("Failed to send verification email");
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
