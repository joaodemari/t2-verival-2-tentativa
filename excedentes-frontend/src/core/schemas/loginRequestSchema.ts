import { z } from "zod";

export const loginRequestSchema = z.object({
    email: z.string().email({ message: "Email do Contratante é necessário" }),
    password: z.string().min(6, { message: "Senha do Contratante é necessário" })
});

export type ILoginRequest = z.infer<typeof loginRequestSchema>;