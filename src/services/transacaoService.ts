import api from "../api/config";
import type { Transacao } from "../types";

export const transacaoService = {
  buscarPorConta: (numeroConta: number) => {
    return api.get<Transacao[]>(`/transacoes/conta/${numeroConta}`);
  },

  depositar: (numeroConta: number, valor: number) => {
    return api.post(`/contas/${numeroConta}/deposito`, { valor });
  },

  sacar: (numeroConta: number, valor: number, pin: string) => {
    return api.post(`/contas/${numeroConta}/saque`, { valor, pin });
  },

  transferir: (
    contaOrigem: number,
    contaDestino: number,
    valor: number,
    pin: string
  ) => {
    return api.post("/contas/transferencia", {
      contaOrigem,
      contaDestino,
      valor,
      pin,
    });
  },
};
