import { z } from 'zod';
import { createProductsSchema } from '../schemas/createProductSchema';

export type ICreateProduct = z.infer<typeof createProductsSchema>;

export interface ICreateProductRequest {
    name: string,
    description: string,
    price: number,
    brand: string,
    expiration_date: Date,
    quantity: number,
    category: string,
    bar_code: string,
    picture?: string | null,
}