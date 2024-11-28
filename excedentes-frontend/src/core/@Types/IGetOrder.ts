export interface IGetOrder {
  cart_item_id: number;
  code?: number;
  order_id: number;
  product_name: string;
  product_id: number;
  product_quantity: number;
  seller_id: number;
  seller_name: string;
  expiration_date: Date;
  quantity: number;
  price: number;
}
