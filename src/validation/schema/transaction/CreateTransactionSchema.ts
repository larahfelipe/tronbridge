import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  address: z.object({
    origin: z
      .string()
      .nonempty('Origin address is required')
      .transform((value) => value.trim()),
    recipient: z
      .string()
      .nonempty('Recipient address is required')
      .transform((value) => value.trim())
  }),
  token: z
    .object({
      id: z
        .string()
        .transform((value) => value.trim())
        .optional(),
      decimals: z
        .number()
        .nonnegative('Token decimals must be greater than or equal to 0')
        .optional()
    })
    .refine(
      ({ id, decimals }) => (!id && decimals && decimals > 0 ? false : true),
      "Token ID is required when withdrawing a specific token. If you're withdrawing TRX, set the `id` and `decimals` parameters respectively to '' and `0`"
    ),
  signingKey: z
    .string()
    .nonempty('Signing key is required')
    .transform((value) => value.trim())
});

export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
