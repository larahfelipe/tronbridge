import { z } from 'zod';

export const GetAllTransactionsSchema = z.object({
  address: z
    .string()
    .nonempty('Account address is required')
    .transform((value) => value.trim()),
  limit: z
    .preprocess(
      (value) => Number(value),
      z
        .number()
        .int()
        .min(1, 'Limit must be greater than 0')
        .max(200, 'Limit must be less than or equal to 200')
    )
    .optional()
});

export type GetAllTransactionsSchemaType = z.infer<
  typeof GetAllTransactionsSchema
>;
