import React from "react";

interface ModalEmitirCartaoProps {
  isOpen: boolean;
  tipoSelecionado: string;
  onTipoChange: (tipo: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalEmitirCartao: React.FC<ModalEmitirCartaoProps> = ({
  isOpen,
  tipoSelecionado,
  onTipoChange,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Emitir Cartão</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Selecione o Tipo de Cartão
          </label>
          <select
            value={tipoSelecionado}
            onChange={(e) => onTipoChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-800"
          >
            <option value="DEBITO">Débito</option>
            <option value="CREDITO">Crédito (Limite: R$ 5.000)</option>
            <option value="PRE_PAGO">Pré-pago</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium transition"
          >
            Emitir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEmitirCartao;
