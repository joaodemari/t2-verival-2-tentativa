/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ICreateContractorRequest } from "../@Types/ICreateContractor";
import http from "../../config/axios.config";
import { ContractorDTO } from "../@Types/IContractor";
import { LoginMeDto } from "../@Types/ILoginMe";

const contractortUrl = "/contractor-companies";

export const postContractor = async (contractor: ICreateContractorRequest) => {
  const response = await http.post(contractortUrl, contractor);
  return response.data;
};

export const getSelfContractor = async (): Promise<ContractorDTO> => {
  const selfData = await http.get<LoginMeDto>("/login/me");
  return getContractor(selfData.data.sub);
};

export const getContractor = async (id: number): Promise<ContractorDTO> => {
  const response = await http.get<ContractorDTO>(`${contractortUrl}?id=${id}`);
  return response.data;
};
