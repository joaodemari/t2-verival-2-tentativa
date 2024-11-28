import http from "../../config/axios.config";
import { IResponsBase } from "../@Types/ResponseBase";
import Client from "../models/Client";

const GetClients = () => {
  return http.get<Client[]>(`/client`);
}

const GetClientsByCpf = (cpf: string) =>
  http.get<IResponsBase<Client>>(`/client/${cpf}`);

export { GetClients, GetClientsByCpf };
