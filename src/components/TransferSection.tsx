import { useState } from "react";
import { transacaoService } from "../services/transacaoService";
import type { ClienteCompleto } from "../types";

interface TransferSectionProps {
  clienteData: ClienteCompleto;
  onSuccess: () => void;
}

export function TransferSection({
  clienteData,
  onSuccess,
}: TransferSectionProps) {
  const [transferData, setTransferData] = useState({
    contaDestino: "",
    valor: "",
    pin: "",
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !transferData.contaDestino ||
      !transferData.valor ||
      !transferData.pin
    ) {
      alert("Preencha todos os campos");
      return;
    }

    if (!clienteData.contas || clienteData.contas.length === 0) {
      alert("Nenhuma conta encontrada");
      return;
    }

    try {
      await transacaoService.transferir(
        clienteData.contas[0].numeroConta,
        parseInt(transferData.contaDestino),
        parseFloat(transferData.valor),
        transferData.pin
      );

      alert("Transferência realizada com sucesso!");
      setTransferData({ contaDestino: "", valor: "", pin: "" });
      onSuccess();
    } catch {
      alert("Erro ao realizar transferência");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        💸 Transferência
      </h3>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conta de Destino
          </label>
          <input
            type="number"
            value={transferData.contaDestino}
            onChange={(e) =>
              setTransferData((prev) => ({
                ...prev,
                contaDestino: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Número da conta"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor
          </label>
          <input
            type="number"
            step="0.01"
            value={transferData.valor}
            onChange={(e) =>
              setTransferData((prev) => ({
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
            value={transferData.pin}
            onChange={(e) =>
              setTransferData((prev) => ({
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
          className="w-full bg-pink-500 text-white py-2 px-4 rounded-md hover:bg-pink-600 transition-colors"
        >
          Transferir
        </button>
      </form>
    </div>
  );
}
