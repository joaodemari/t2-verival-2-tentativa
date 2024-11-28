class Client {
  id: number;
  nome: string;
  senha: string;
  cpfcnpj: string;
  email: string;
  tipo: string

  constructor({ id, nome, senha, cpfcnpj, email, tipo }: Client) {
    this.id = id;
    this.nome = nome;
    this.senha = senha;
    this.cpfcnpj = cpfcnpj;
    this.email = email;
    this.tipo = tipo;
  }
}

export default Client;
