import { z } from 'zod';

import { ResourceTypes } from '@/config';

export const CreateStakingTransactionSchema = z.object({
  resourceType: z
    .string()
    .nonempty('Resource type is required')
    .transform((value) => value.trim().toLowerCase())
    .refine(
      (value) =>
        Object.values(ResourceTypes).includes(
          value as (typeof ResourceTypes)[keyof typeof ResourceTypes]
        ),
      'Resource type must be BANDWIDTH or ENERGY'
    ),
  address: z
    .string()
    .nonempty('Address is required')
    .transform((value) => value.trim()),
  amount: z.number().positive('Amount must be greater than 0'),
  signingKey: z
    .string()
    .nonempty('Signing key is required')
    .transform((value) => value.trim())
});

export type CreateStakingTransactionSchemaType = z.infer<
  typeof CreateStakingTransactionSchema
>;
