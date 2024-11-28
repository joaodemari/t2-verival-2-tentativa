import http from "../../config/axios.config";
import { ILogin } from "../@Types/ILogin";
import { ILoginRequest } from "../@Types/ILoginRequest";

const loginUrl = '/login';

export const postLogin = async (loginData: ILoginRequest): Promise<ILogin> => {
    const response = await http.post<ILogin>(loginUrl, loginData);
    return response.data; 
}