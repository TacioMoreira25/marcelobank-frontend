import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DepositoForm: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="bg-gradient-to-br from-rose-50 to-white p-6 rounded-lg border border-rose-100">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Valor do Depósito
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
            R$
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg font-medium"
            type="number"
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Digite o valor que deseja depositar em sua conta
        </p>
      </div>

      <button
        className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white rounded-lg font-semibold transition duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={!value || parseFloat(value) <= 0}
      >
        Confirmar Depósito
      </button>
    </form>
  );
};

export default DepositoForm;
