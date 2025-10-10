import { useState } from "react";
import { transacaoService } from "../services/transacaoService";
import type { ClienteCompleto } from "../types";

interface SaqueSectionProps {
  clienteData: ClienteCompleto;
  onSuccess: () => void;
}

export function SaqueSection({ clienteData, onSuccess }: SaqueSectionProps) {
  const [saqueData, setSaqueData] = useState({
    valor: "",
    pin: "",
  });

  const handleSaque = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!saqueData.valor || !saqueData.pin) {
      alert("Preencha todos os campos");
      return;
    }

    if (!clienteData.contas || clienteData.contas.length === 0) {
      alert("Nenhuma conta encontrada");
      return;
    }

    try {
      await transacaoService.sacar(
        clienteData.contas[0].numeroConta,
        parseFloat(saqueData.valor),
        saqueData.pin
      );

      alert("Saque realizado com sucesso!");
      setSaqueData({ valor: "", pin: "" });
      onSuccess();
    } catch {
      alert("Erro ao realizar saque");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">💸 Saque</h3>
      <form onSubmit={handleSaque} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            value={saqueData.valor}
            onChange={(e) =>
              setSaqueData((prev) => ({
                ...prev,
                valor: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="0,00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN
          </label>
          <input
            type="password"
            maxLength={4}
            value={saqueData.pin}
            onChange={(e) =>
              setSaqueData((prev) => ({
                ...prev,
                pin: e.target.value.replace(/\D/g, "").slice(0, 4),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors"
        >
          Sacar
        </button>
      </form>
    </div>
  );
}
