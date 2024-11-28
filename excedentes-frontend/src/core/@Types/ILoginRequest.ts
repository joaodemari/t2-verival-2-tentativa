import { z } from 'zod';
import { loginRequestSchema } from '../schemas/loginRequestSchema';

export type ILoginRequestData = z.infer<typeof loginRequestSchema>;

export interface ILoginRequest {
    email: string,
    password: string,
}