import { z } from "zod";

export const signUpSchemaValidation = z.object({
  username: z
    .string()
    .min(2, "Username must contains atleast 2 characters")
    .max(20, "Username must not more than 20 characters")
    .regex(
      /^[a-zA-Z0-9]{5,20}$/,
      "Username must be 5-20 characters long and can only contain letters and numbers"
    ),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
});
