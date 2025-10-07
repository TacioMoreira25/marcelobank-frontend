import api from '../api/config';
import type { Emprestimo } from '../types';

export const emprestimoService = {

  solicitar: (cpf: string, valorSolicitado: number, prazoMeses: number) => {
    return api.post<Emprestimo>('/emprestimos/solicitar', {
      cpf,
      valorSolicitado,
      prazoMeses
    });
  },

  aprovar: (idEmprestimo: number, valorAprovado: number) => {
    return api.post<Emprestimo>(`/emprestimos/${idEmprestimo}/aprovar`, {
      valorAprovado
    });
  },

  pagarParcela: (idEmprestimo: number, valorPagamento: number) => {
    return api.post(`/emprestimos/${idEmprestimo}/pagar`, {
      valorPagamento
    });
  },

  consultarSaldoDevedor: (cpf: string) => {
    return api.get(`/emprestimos/saldo-devedor/${cpf}`);
  },
};
