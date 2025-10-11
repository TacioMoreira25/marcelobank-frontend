import React from "react";

interface Props {
  values: { valor: string; pin: string };
  onChange: (vals: { valor?: string; pin?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const Saque: React.FC<Props> = ({ values, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center mb-2">
        <label className="w-16">Valor</label>
        <input
          className="border p-1 ml-2 rounded opacity-25 flex-1"
          type="number"
          step="0.01"
          value={values.valor}
          onChange={(e) => onChange({ valor: e.target.value })}
        />
      </div>
      <div className="flex items-center mb-2">
        <label className="w-16">PIN</label>
        <input
          className="border p-1 ml-2 rounded opacity-25 flex-1"
          type="password"
          maxLength={4}
          value={values.pin}
          onChange={(e) =>
        onChange({ pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
          }
        />
      </div>
      <button className="px-3 py-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded" type="submit">
        Sacar
      </button>
    </form>
  );
};

export default Saque;
