import { z } from 'zod';

export const GetTokenSchema = z.object({
  id: z
    .string()
    .nonempty('Token ID is required')
    .transform((value) => value.trim()),
  include_abi: z
    .string()
    .transform((value) => value === 'true')
    .optional() as unknown as z.ZodOptional<z.ZodBoolean>,
  include_bytecode: z
    .string()
    .transform((value) => value === 'true')
    .optional() as unknown as z.ZodOptional<z.ZodBoolean>
});

export type GetTokenSchemaType = z.infer<typeof GetTokenSchema>;
