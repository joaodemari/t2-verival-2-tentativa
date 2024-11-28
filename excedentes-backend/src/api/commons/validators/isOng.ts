import axios from 'axios';

const apiUrl = 'https://publica.cnpj.ws/cnpj/${cnpj}';

export async function isOng(cnpj: string): Promise<boolean> {
  const url = apiUrl.replace('${cnpj}', cnpj);
  const response = await axios.get(url);

  //id = 3999 ou 3069

  return (
    response.data.natureza_juridica.id == '3999' ||
    response.data.natureza_juridica.id == '3069'
  );
}
