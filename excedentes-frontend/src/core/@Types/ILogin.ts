import { z } from 'zod';
import { loginResponseSchema } from '../schemas/loginResponseSchema';

export type ILogin = z.infer<typeof loginResponseSchema>;
