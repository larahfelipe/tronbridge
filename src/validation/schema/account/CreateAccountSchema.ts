import { z } from 'zod';

import { Network } from '@/config';

export const CreateAccountSchema = z.object({
  network: z
    .string()
    .nonempty('Network is required')
    .transform((value) => value.trim().toUpperCase())
    .refine(
      (value) => Object.values(Network).includes(value),
      `Network must be ${Network.MAINNET} or ${Network.TESTNET}`
    )
});
