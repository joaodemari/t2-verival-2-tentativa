import http from "../../config/axios.config";
import { IClient } from "../@Types/Client";

const consumertUrl = "/consumers";

export const postConsumer = async (
  consumer: Omit<IClient, "id">
): Promise<IClient> => {
  const response = await http.post<IClient>(consumertUrl, consumer);
  return response.data;
};
