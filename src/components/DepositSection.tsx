import { useState } from "react";
import { transacaoService } from "../services/transacaoService";
import type { ClienteCompleto } from "../types";

interface DepositSectionProps {
  clienteData: ClienteCompleto;
  onSuccess: () => void;
}

export function DepositSection({
  clienteData,
  onSuccess,
}: DepositSectionProps) {
  const [depositData, setDepositData] = useState({
    valor: "",
  });

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!depositData.valor) {
      alert("Preencha o valor");
      return;
    }

    if (!clienteData.contas || clienteData.contas.length === 0) {
      alert("Nenhuma conta encontrada");
      return;
    }

    try {
      await transacaoService.depositar(
        clienteData.contas[0].numeroConta,
        parseFloat(depositData.valor)
      );

      alert("Depósito realizado com sucesso!");
      setDepositData({ valor: "" });
      onSuccess();
    } catch {
      alert("Erro ao realizar depósito");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Depósito</h3>
      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            value={depositData.valor}
            onChange={(e) =>
              setDepositData((prev) => ({
                ...prev,
                valor: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="0,00"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Depositar
        </button>
      </form>
    </div>
  );
}
