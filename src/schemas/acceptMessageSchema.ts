import { z } from "zod";

export const acceptMessageSchemaValidation = z.object({
  accepting: z.boolean(),
});
