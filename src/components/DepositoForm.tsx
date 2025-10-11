import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DepositoForm: React.FC<Props> = ({ value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="border p-3 rounded space-y-2">
      <div>
        <label>Valor</label>
        <input
          className="border p-1 ml-2"
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <button
        className="px-3 py-1 bg-green-600 text-white rounded"
        type="submit"
      >
        Depositar
      </button>
    </form>
  );
};

export default DepositoForm;
