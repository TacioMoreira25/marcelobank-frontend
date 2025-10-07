export type TipoConta = 'CORRENTE' | 'POUPANCA' | 'SALARIO' | 'INVESTIMENTO';

export type TipoCartao = 'CREDITO' | 'DEBITO' | 'CREDITO_DEBITO' | 'VIRTUAL' | 'PRE_PAGO';

export type StatusEmprestimo =
  | 'SOLICITADO'
  | 'EM_ANALISE'
  | 'APROVADO'
  | 'REPROVADO'
  | 'LIQUIDADO'
  | 'EM_ATRASO';

export type StatusTransacao =
  | 'PENDENTE'
  | 'CONCLUIDA'
  | 'CANCELADA'
  | 'FALHA'
  | 'SALDO_INSUFICIENTE';

export interface Cliente {
  idCliente?: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  dataCadastro?: string;
}

export interface Agencia {
  codigoAgencia: number;
  nomeAgencia?: string;
  endereco?: string;
  telefone?: string;
  gerente?: string;
}

export interface Conta {
  numeroConta: number;
  tipoConta: TipoConta;
  saldo: number;
  dataAbertura?: string;
  status?: string;
  cliente?: Cliente;
  agencia?: Agencia;
}

export interface Cartao {
  numeroCartao: number;
  tipoCartao: TipoCartao;
  dataEmissao?: string;
  dataValidade?: string;
  status?: string;
  limite: number;
  conta?: Conta;
}

export interface Transacao {
  idTransacao?: number;
  contaOrigem?: Conta;
  contaDestino?: Conta;
  tipoTransacao: string;
  valor: number;
  dataTransacao?: string;
  horaTransacao?: string;
  descricao?: string;
  status?: StatusTransacao;
}

export interface Emprestimo {
  idEmprestimo?: number;
  cliente?: Cliente;
  valorSolicitado: number;
  valorAprovado?: number;
  taxaJuros?: number;
  prazoMeses: number;
  dataSolicitacao?: string;
  dataAprovacao?: string;
  status?: StatusEmprestimo;
  saldoDevedor?: number;
}
