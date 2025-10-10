import React from "react";

interface Props {
  values: { valor: string; pin: string };
  onChange: (vals: { valor?: string; pin?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SaqueForm: React.FC<Props> = ({ values, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="border p-3 rounded space-y-2">
      <div>
        <label>Valor</label>
        <input
          className="border p-1 ml-2"
          type="number"
          step="0.01"
          value={values.valor}
          onChange={(e) => onChange({ valor: e.target.value })}
        />
      </div>
      <div>
        <label>PIN</label>
        <input
          className="border p-1 ml-2"
          type="password"
          maxLength={4}
          value={values.pin}
          onChange={(e) =>
            onChange({ pin: e.target.value.replace(/\D/g, "").slice(0, 4) })
          }
        />
      </div>
      <button className="px-3 py-1 bg-red-600 text-white rounded" type="submit">
        Sacar
      </button>
    </form>
  );
};

export default SaqueForm;
