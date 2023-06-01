import { z } from 'zod';

export const GetAccountSchema = z.object({
  address: z
    .string()
    .nonempty('Account address is required')
    .transform((value) => value.trim())
});

export type GetAccountSchemaType = z.infer<typeof GetAccountSchema>;
