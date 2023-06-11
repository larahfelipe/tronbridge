import { z } from 'zod';

export const RecoverAccountFromMnemonicsSchema = z.object({
  mnemonics: z
    .array(z.string())
    .min(12, "Mnemonic words can't be less than 12 words")
    .max(24, "Mnemonic words can't be more than 24 words")
    .nonempty('Mnemonic words is required')
    .transform((values) =>
      values.map((value) => value.trim().toLowerCase()).join(' ')
    ) as unknown as z.ZodString
});

export type RecoverAccountFromMnemonicsSchemaType = z.infer<
  typeof RecoverAccountFromMnemonicsSchema
>;
