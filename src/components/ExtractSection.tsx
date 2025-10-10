import { formatCurrency, formatDate } from "../utils/formatters";
import type { Transacao } from "../types";

interface ExtractSectionProps {
  transacoes: Transacao[];
}

export function ExtractSection({ transacoes }: ExtractSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Extrato</h3>

      {transacoes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Nenhuma transação encontrada.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transacoes.map((transacao, index) => (
            <div
              key={transacao.idTransacao || index}
              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {transacao.tipoTransacao}
                </p>
                <p className="text-sm text-gray-600">
                  {formatDate(transacao.dataTransacao || "")}
                </p>
                {transacao.descricao && (
                  <p className="text-sm text-gray-500">{transacao.descricao}</p>
                )}
              </div>
              <div className="text-right">
                <p
                  className={`font-bold ${
                    transacao.tipoTransacao === "DEPOSITO"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transacao.tipoTransacao === "DEPOSITO" ? "+" : "-"}
                  {formatCurrency(transacao.valor)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
