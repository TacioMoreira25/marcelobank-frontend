import api from "../api/config";
import type { Conta, CriarContaDTO } from "../types";

export const contaService = {
  listarContas: () => {
    return api.get<Conta[]>("/contas");
  },

  buscarPorNumero: (numeroConta: number) => {
    return api.get<Conta>(`/contas/${numeroConta}`);
  },

  buscarPorCpf: (cpf: string) => {
    return api.get<Conta[]>(`/contas/cliente/${cpf}`);
  },

  criarConta: (criarContaDTO: CriarContaDTO) => {
    return api.post<Conta>("/contas", criarContaDTO);
  },

  consultarSaldo: (numeroConta: number) => {
    return api.get<Conta>(`/contas/${numeroConta}/saldo`);
  },

  deletarConta: (numeroConta: number) => {
    return api.delete(`/contas/${numeroConta}`);
  },
};
