import { z } from "zod";

export const messageSchemaValidation = z.object({
  content: z
    .string()
    .min(5, "Content must contains atleast 5 characters")
    .max(200, "Content must not more than 200 characters"),
});
