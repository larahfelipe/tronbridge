import { z } from 'zod';

export const CreateAccountSchema = z.object({
  with_mnemonics: z
    .string()
    .transform((value) => value === 'true')
    .optional() as unknown as z.ZodOptional<z.ZodBoolean>
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
