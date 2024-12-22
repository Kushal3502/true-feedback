import { z } from "zod";

export const verifySchemaValidation = z.object({
  code: z.string().length(6, "Code must contain 6 digits"),
});
