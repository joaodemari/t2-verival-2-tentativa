import { z } from "zod";

export const createContractorSchema = z.object({
    name: z.string().min(1, { message: "Nome do Contratante é necessário" }),
    email: z.string().email({ message: "Email do Contratante é necessário" }),
    password: z.string().min(6, { message: "Senha do Contratante é necessário" }),
    confirmPassword: z.string().min(6, { message: "As senhas não conferem" }),
    address: z.object({
        formattedName: z.string().min(1, { message: "Endereço do Contratante é necessário" }),
    }),
    cnpj: z.string().min(14, { message: "CNPJ do Contratante é necessário" }),
    workingHours: z.string().min(1, { message: "Horário Comercial do Contratante é necessário" }),
    terms: z
      .boolean()
      .refine((data) => data === true, "Você deve aceitar os termos de uso"),
});
