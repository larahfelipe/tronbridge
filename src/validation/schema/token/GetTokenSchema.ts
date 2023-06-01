import { z } from 'zod';

export const GetTokenSchema = z.object({
  id: z
    .string()
    .nonempty('Token ID is required')
    .transform((value) => value.trim()),
  include_abi: z.preprocess((value) => Boolean(value), z.boolean()).optional(),
  include_bytecode: z
    .preprocess((value) => Boolean(value), z.boolean())
    .optional()
});

export type GetTokenSchemaType = z.infer<typeof GetTokenSchema>;
