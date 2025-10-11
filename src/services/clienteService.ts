import api from "../api/config";
import type { Cliente, AtualizarClienteDTO } from "../types";

export const clienteService = {
  criar: (cliente: Cliente) => {
    return api.post<Cliente>("/clientes", cliente);
  },
  atualizar: (cpf: string, dto: AtualizarClienteDTO) => {
    return api.put<Cliente>(`/clientes/cpf/${cpf}`, dto);
  },

  buscarPorCpf: (cpf: string) => {
    return api.get<Cliente>(`/clientes/cpf/${cpf}`);
  },

  buscarInfoCompleta: (cpf: string) => {
    return api.get(`/clientes/cpf/${cpf}/completo`);
  },
};
