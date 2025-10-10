import React from "react";
import type { ClienteCompleto } from "../types";

interface Props {
  cliente: ClienteCompleto;
  saldo: number;
  numeroConta?: number;
  onLogout: () => void;
}

const Header: React.FC<Props> = ({ cliente, saldo, numeroConta, onLogout }) => {
  const c = cliente;
  const contaNum = numeroConta ?? c.contas?.[0]?.numeroConta;
  return (
    <div className="border p-3 rounded">
      <div className="flex justify-between items-center">
        <div>
          <div>
            <b>Cliente:</b> {c.nome}
          </div>
          <div>
            <b>CPF:</b> {c.cpf}
          </div>
          <div>
            <b>Email:</b> {c.email}
          </div>
        </div>
        <div className="text-right">
          <div>
            <b>Conta:</b> {contaNum}
          </div>
          <div>
            <b>Saldo:</b> R$ {saldo.toFixed(2)}
          </div>
          <button
            className="mt-2 px-3 py-1 bg-gray-200 rounded"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
