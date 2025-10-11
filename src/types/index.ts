export type TipoConta = "CORRENTE" | "POUPANCA";

export type TipoCartao = "CREDITO" | "DEBITO" | "PRE_PAGO";

export type StatusEmprestimo =
  | "SOLICITADO"
  | "EM_ANALISE"
  | "APROVADO"
  | "REPROVADO"
  | "LIQUIDADO"
  | "EM_ATRASO";

export type StatusTransacao =
  | "PENDENTE"
  | "CONCLUIDA"
  | "CANCELADA"
  | "FALHA"
  | "SALDO_INSUFICIENTE"
  | "ESTORNADA";

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
  pin: number | string;
  saldo: number;
  dataAbertura?: string;
  status?: string;
  cliente?: Cliente;
  agencia?: Agencia;
}

export interface CriarContaDTO {
  cpf: string;
  tipoConta: TipoConta;
  pin: string;
  saldoInicial: number;
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
  contaOrigem?: Conta | number;
  contaDestino?: Conta | number;
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

export interface LoginRequest {
  cpf: string;
  pin: string;
}

export interface LoginResponse {
  sucesso: boolean;
  numeroConta?: number;
  nomeCliente?: string;
  cpfCliente?: string;
  tipoConta?: string;
  saldo?: number;
  status?: string;
  mensagem?: string;
}

export interface ClienteCompleto {
  cliente?: Cliente;
  contas?: Conta[];
  cartoes?: Cartao[];
  emprestimos?: Emprestimo[];
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
}

// DTO para atualização parcial de Cliente
export interface AtualizarClienteDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  endereco?: string;
}
