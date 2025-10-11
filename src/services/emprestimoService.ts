import api from "../api/config";
import type { Emprestimo } from "../types";

export const emprestimoService = {
  listar: () => {
    return api.get<Emprestimo[]>("/emprestimos");
  },

  buscarPorId: (id: number) => {
    return api.get<Emprestimo>(`/emprestimos/${id}`);
  },

  buscarPorCliente: (cpf: string) => {
    return api.get<Emprestimo[]>(`/emprestimos/cliente/${cpf}`);
  },

  solicitar: (cpf: string, valorSolicitado: number, prazoMeses: number) => {
    return api.post<Emprestimo>("/emprestimos", {
      cpf,
      valorSolicitado,
      prazoMeses,
    });
  },

  aprovar: (id: number, valorAprovado: number) => {
    return api.patch<Emprestimo>(`/emprestimos/${id}/aprovar`, {
      valorAprovado,
    });
  },

  pagarParcela: (id: number, valorPagamento: number) => {
    return api.post(`/emprestimos/${id}/pagar-parcela`, {
      valorPagamento,
    });
  },
};
