import React from "react";
import { createPortal } from "react-dom";

interface ModalEmitirCartaoProps {
  isOpen: boolean;
  tipoSelecionado: string;
  limiteSelecionado: string;
  onTipoChange: (tipo: string) => void;
  onLimiteChange: (limite: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalEmitirCartao: React.FC<ModalEmitirCartaoProps> = ({
  isOpen,
  tipoSelecionado,
  limiteSelecionado,
  onTipoChange,
  onLimiteChange,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isCredito = tipoSelecionado === "CREDITO";

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 9999, background: "transparent" }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Emitir Novo Cartão
        </h2>

        <div className="space-y-4">
          {/* Seleção do tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo do Cartão
            </label>
            <select
              value={tipoSelecionado}
              onChange={(e) => onTipoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
              <option value="PRE_PAGO">Pré-pago</option>
            </select>
          </div>

          {/* Campo de limite (apenas para crédito) */}
          {isCredito && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Limite de Crédito (R$)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={limiteSelecionado}
                onChange={(e) => onLimiteChange(e.target.value)}
                placeholder="Ex: 1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Informe o limite desejado para o cartão de crédito
              </p>
            </div>
          )}

          {!isCredito && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>
                  {tipoSelecionado === "DEBITO"
                    ? "Cartão de Débito"
                    : "Cartão Pré-pago"}
                  :
                </strong>{" "}
                {tipoSelecionado === "DEBITO"
                  ? "Utiliza o saldo disponível em sua conta."
                  : "Requer carregamento de valores para uso."}
              </p>
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={
              isCredito &&
              (!limiteSelecionado || parseFloat(limiteSelecionado) <= 0)
            }
            className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Emitir Cartão
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalEmitirCartao;
