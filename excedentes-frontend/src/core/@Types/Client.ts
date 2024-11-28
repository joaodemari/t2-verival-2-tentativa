export interface IClient {
  id: number;
  nome: string;
  password: string;
  cpf_cnpj: string;
  email: string;
  tipo: string;
}

export const enum TipoCliente {
  PessoaFisica = "Pessoa Fisica",
  PessoaJuridica = "Pessoa Juridica",
}
