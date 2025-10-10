import api from '../api/config';
import type { Cliente } from '../types';

export const clienteService = {

  listar: () => {
    return api.get<Cliente[]>('/clientes');
  },

  criar: (cliente: Cliente) => {
    return api.post<Cliente>('/clientes', cliente);
  },
  atualizar: (cpf: string, cliente: Cliente) => {
    return api.put<Cliente>(`/clientes/${cpf}`, cliente);
  },

  deletar: (cpf: string) => {
    return api.delete(`/clientes/${cpf}`);
  },

  buscarInfoCompleta: (cpf: string) => {
    return api.get(`/clientes/cpf/${cpf}/completo`);
  }
};
