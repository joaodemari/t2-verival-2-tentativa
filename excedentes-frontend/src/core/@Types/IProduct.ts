export interface IProduct {
  id: number;
  picture: string;
  name: string;
  description: string;
  quantity: number;
  price: string;
  brand: string;
  category: string;
  expirationDate: string;
  distance: number;
}

export interface IHomeProduct {
  id: number;
  name: string;
  category: string;
  price: string;
  quantity: number;
  expiration_date: string;
  picture: string;
  brand: string;
  distance: number;
  company: ContractorCompany;
}

export interface ContractorCompany {
  id: number;
  name: string;
}
