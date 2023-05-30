import { z } from 'zod';

import { ContractTypes, ResourceTypes } from '@/config';

export const CreateStakeTransactionSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  address: z
    .string()
    .nonempty('Address is required')
    .transform((value) => value.trim()),
  contractType: z
    .string()
    .nonempty('Contract type is required')
    .transform((value) => value.trim().toLowerCase())
    .refine(
      (value) =>
        Object.values(ContractTypes).includes(
          value as (typeof ContractTypes)[keyof typeof ContractTypes]
        ),
      'Contract type must be FREEZE_CONTRACT or UNFREEZE_CONTRACT'
    ),
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
  signingKey: z
    .string()
    .nonempty('Signing key is required')
    .transform((value) => value.trim())
});

export type CreateStakeTransactionSchemaType = z.infer<
  typeof CreateStakeTransactionSchema
>;
