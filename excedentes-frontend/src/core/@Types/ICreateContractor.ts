import { createContractorSchema } from "../schemas/createContractorSchema";
import { z } from 'zod'

export type ICreateContractor = z.infer<typeof createContractorSchema>;

export interface ICreateContractorRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    address: {
        formattedName: string;
        latitude: number;
        longitude: number;
    };
    cnpj: string;
    workingHours: string;
}
