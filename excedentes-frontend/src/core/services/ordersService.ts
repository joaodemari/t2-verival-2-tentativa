import http from "../../config/axios.config";
import { IGetOrder } from "../@Types/IGetOrder";

const ordersUrl = '/orders';

export const getOrderCart = async (): Promise<IGetOrder[]> => {
    const response = await http.get<IGetOrder[]>(`${ordersUrl}/cart`);
    return response.data;
}

export const editItemQuantity = async (quantity: number, product_id: number): Promise<IGetOrder> => {
    const response = await http.put<IGetOrder>(`${ordersUrl}/cart/update`, { quantity, product_id });
    return response.data;
}

export const deleteItem = async (item_cart_id: number): Promise<IGetOrder> => {
    const response = await http.delete<IGetOrder>(`${ordersUrl}/cart-item/${item_cart_id}`);
    return response.data;
}

export const finishOrder = async (): Promise<{ message: string, order: IGetOrder}> => {
    const response = await http.patch<{ message: string, order: IGetOrder}>(`${ordersUrl}/buy`);
    return response.data;
}

export const addItemToCart = async (product_id: number, quantity: number): Promise<IGetOrder> => {
    const response = await http.post<IGetOrder>(`${ordersUrl}/cart`, { product_id, quantity });
    return response.data;
}