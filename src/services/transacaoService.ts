import api from "../api/config";
import type { Transacao } from "../types";

export const transacaoService = {
  listar: () => {
    return api.get<Transacao[]>("/transacoes");
  },

  depositar: (numeroConta: number, valor: number) => {
    return api.post("/transacoes/deposito", { numeroConta, valor });
  },

  sacar: (numeroConta: number, valor: number) => {
    return api.post("/transacoes/saque", { numeroConta, valor });
  },

  transferir: (contaOrigem: number, contaDestino: number, valor: number) => {
    return api.post("/transacoes/transferencia", {
      contaOrigem,
      contaDestino,
      valor,
    });
  },

  extrato: (numeroConta: number) => {
    return api.get<Transacao[]>(`/transacoes/extrato/${numeroConta}`);
  },
};
