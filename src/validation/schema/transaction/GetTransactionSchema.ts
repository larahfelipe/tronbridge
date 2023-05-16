import { z } from 'zod';

export const GetTransactionSchema = z.object({
  id: z
    .string()
    .nonempty('Transaction ID is required')
    .transform((value) => value.trim())
});

export type GetTransactionSchemaType = z.infer<typeof GetTransactionSchema>;
