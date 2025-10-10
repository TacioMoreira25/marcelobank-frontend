import api from "../api/config";
import type { Conta, CriarContaDTO } from "../types";
import type { Cartao } from "../types";

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

  emitirCartao: (
    numeroCartao: number,
    numeroConta: number,
    tipoCartao: string,
    limite: number
  ) => {
    return api.post<Cartao>("/cartoes/emitir", {
      numeroCartao,
      numeroConta,
      tipoCartao,
      limite,
    });
  },

  bloquear: (numeroCartao: number) => {
    return api.put(`/cartoes/${numeroCartao}/bloquear`);
  },

  listarCartoesPorCliente: (cpf: string) => {
    return api.get<Cartao[]>(`/cartoes/cliente/${cpf}`);
  },
};
