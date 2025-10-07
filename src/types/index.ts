export interface Cliente {
  idCliente?: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
}

export interface Conta {
  numeroConta: number;
  tipoConta: 'CORRENTE' | 'POUPANCA' | 'SALARIO' | 'INVESTIMENTO';
  saldo: number;
  status?: string;
  cliente?: Cliente;
}

export interface Transacao {
  idTransacao?: number;
  tipoTransacao: string;
  valor: number;
  dataTransacao?: string;
  status?: string;
}
