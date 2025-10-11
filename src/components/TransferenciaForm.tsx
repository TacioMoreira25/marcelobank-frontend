import React from "react";

interface Props {
  values: { contaDestino: string; valor: string; pin: string };
  onChange: (vals: {
    contaDestino?: string;
    valor?: string;
    pin?: string;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const TransferenciaForm: React.FC<Props> = ({ values, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="border p-3 rounded space-y-2">
      <div>
        <label>Conta destino</label>
        <input
          className="border p-1 ml-2"
          type="number"
          value={values.contaDestino}
          onChange={(e) => onChange({ contaDestino: e.target.value })}
        />
      </div>
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
      <button
        className="px-3 py-1 bg-pink-500 text-white rounded"
        type="submit"
      >
        Transferir
      </button>
    </form>
  );
};

export default TransferenciaForm;
