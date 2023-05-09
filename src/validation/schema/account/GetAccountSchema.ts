import { z } from 'zod';

export const GetAccountSchema = z.object({
  address: z
    .string()
    .nonempty('Address is required')
    .transform((value) => value.trim())
});

export type GetAccountSchemaType = z.infer<typeof GetAccountSchema>;
