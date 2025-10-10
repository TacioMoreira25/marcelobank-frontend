import api from '../api/config';
import type { LoginRequest } from '../types';
import type { LoginResponse } from '../types';

export const authService = {
  login: (data: LoginRequest) => {
    return api.post<LoginResponse>('/auth/login', data);
  },

  verificarConta: (numeroConta: number) => {
    return api.get(`/auth/verificar-conta?numeroConta=${numeroConta}`);
  },
};
