import http from "../../config/axios.config";
import { IHomeProduct } from "../@Types/IProduct";

export interface GetProductsByLocationProps {
  latitude?: number;
  longitude?: number;
  radius: number;
}

export class ProductsService {
  public getProductsByLocation = (props: GetProductsByLocationProps) => {
    const params =
      props.latitude && props.longitude
        ? {
            clientLatitude: props.latitude,
            clientLongitude: props.longitude,
            clientRadius: props.radius,
          }
        : {};

    return http.get<IHomeProduct[]>(`/products/location`, { params });
  };
}
