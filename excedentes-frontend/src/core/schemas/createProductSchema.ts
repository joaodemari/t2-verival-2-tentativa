import { z } from "zod";

export const createProductsSchema = z.object({
  name: z.string().min(1, { message: "Nome é necessário" }),
  description: z.string().min(1, { message: "Descrição é necessária" }),
  price: z.coerce.number().min(1, { message: "Preço é necessário" }),
  brand: z.string().min(1, { message: "Marca é necessária" }),
  expiration_date: z.coerce
    .date()
    .refine(date => date >= new Date(), { message: "Data de validade inválida" }),
  quantity: z.coerce.number().min(1, { message: "Quantidade é necessária" }),
  category: z.string().min(1, { message: "Categoria é necessária" }),
  picture: z.string().optional(),
  bar_code: z.string().min(5, { message: "Código de barras é necessário" }),
});
