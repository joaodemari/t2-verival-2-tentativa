import http from "../../config/axios.config";
import { ICreateProduct, ICreateProductRequest } from "../@Types/ICreateProduct";
import { IProduct } from "../@Types/IProduct";
import { IUpdateProduct, IUpdateProductRequest } from "../@Types/IUpdateProduct";

const productUrl = '/products';

export const postProduct = async (product: ICreateProductRequest): Promise<ICreateProduct> => {
    const response = await http.post<ICreateProduct>(productUrl, product);
    return response.data;
}

export const getProducts = async (): Promise<ICreateProduct[]> => {
    const response = await http.get<ICreateProduct[]>(productUrl);
    return response.data;
}

export const getProductById = async (id: number): Promise<IUpdateProduct> => {
    const response = await http.get<IUpdateProduct>(`${productUrl}/${id}`);
    return response.data;
}

export const updateProduct = async (id: number, product: IUpdateProductRequest): Promise<IUpdateProduct> => {
    const response = await http.put<IUpdateProduct>(`${productUrl}/${id}`, product);
    return response.data;
}

export const getContractorProducts = async (): Promise<IProduct[]> => {
    const response = await http.get<IProduct[]>(`${productUrl}/mine`);
    return response.data;
}

export const getProductsByLocation = async (latitude: number, longitude: number, radius: number): Promise<IProduct[]> => {
    const response = await http.get<IProduct[]>(`${productUrl}/location`, {
        params: {
            clientLatitude: latitude,
            clientLongitude: longitude,
            clientRadius: radius,
        }
    });
    return response.data;
}

export const deleteProduct = async (id: number): Promise<void> => {
    await http.delete(`/products/mine/${id}`);
  };
