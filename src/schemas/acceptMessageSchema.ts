import { z } from "zod";

export const acceptMessageSchemaValidation = z.object({
  aceepting: z.boolean(),
});
