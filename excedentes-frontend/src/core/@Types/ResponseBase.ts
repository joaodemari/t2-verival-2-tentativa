interface IMensagem {
  tipo: number;
  mensagem: string;
}

export interface IResponsBase<T> {
  retorno: T;
  erros: IMensagem[];
  alertas: IMensagem[];
}
