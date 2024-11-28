import { z } from "zod";

export const loginResponseSchema = z.object({
    access_token: z.string(),
    userType: z.enum(["client", "contractor"])
});

export type ILogin = z.infer<typeof loginResponseSchema>;