import { z } from "zod";

export const messageSchemaValidation = z.object({
  content: z
    .string()
    .min(2, "Content must contains atleast 2 characters")
    .max(200, "Content must not more than 200 characters"),
});
