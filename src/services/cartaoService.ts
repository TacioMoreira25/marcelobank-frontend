import api from "../api/config";
import type { Cartao } from "../types";

export const cartaoService = {
  listar: () => {
    return api.get<Cartao[]>("/cartoes");
  },

  buscarPorCliente: (cpf: string) => {
    return api.get<Cartao[]>(`/cartoes/${cpf}`);
  },

  emitir: (
    numeroCartao: number,
    numeroConta: number,
    tipoCartao: string,
    limite: number
  ) => {
    return api.post<Cartao>("/cartoes", {
      numeroCartao,
      numeroConta,
      tipoCartao,
      limite,
    });
  },

  bloquear: (numeroCartao: number) => {
    return api.patch(`/cartoes/${numeroCartao}/status`, {
      acao: "bloquear",
    });
  },

  desbloquear: (numeroCartao: number) => {
    return api.patch(`/cartoes/${numeroCartao}/status`, {
      acao: "desbloquear",
    });
  },
};
