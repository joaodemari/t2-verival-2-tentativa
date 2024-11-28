export interface ContractorDTO {
  id: number;
  name: string;
  email: string;
  workingHours: string;
  address: {
    formattedName: string;
    latitude: number;
    longitude: number;
  };
}
