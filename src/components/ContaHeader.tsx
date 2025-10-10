import {
  formatCPF,
  formatPhone,
  formatAccountNumber,
  formatCurrency,
} from "../utils/formatters";
import type { ClienteCompleto } from "../types";

interface ContaHeaderProps {
  clienteData: ClienteCompleto;
  saldo: number;
  onLogout: () => void;
}

export function ContaHeader({
  clienteData,
  saldo,
  onLogout,
}: ContaHeaderProps) {
  const cliente = clienteData;
  const conta = cliente.contas?.[0];

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">Bem-vindo, {cliente.nome}</h1>
          <div className="space-y-1 text-sm">
            <p>CPF: {formatCPF(cliente.cpf || "")}</p>
            <p>Email: {cliente.email}</p>
            <p>Telefone: {formatPhone(cliente.telefone || "")}</p>
            {conta && (
              <>
                <p>
                  Conta: {formatAccountNumber(conta.numeroConta.toString())}
                </p>
                <p>Tipo: {conta.tipoConta}</p>
              </>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold mb-2">{formatCurrency(saldo)}</div>
          <p className="text-sm opacity-90">Saldo atual</p>
          <button
            onClick={onLogout}
            className="mt-4 px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
