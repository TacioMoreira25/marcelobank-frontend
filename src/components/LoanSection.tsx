import React from "react";
import type { Emprestimo } from "../types";

interface Props {
  values: { valor: string; prazo: string };
  onChange: (vals: { valor?: string; prazo?: string }) => void;
  onSubmit: (e: React.FormEvent) => void;
  items: Emprestimo[];
}

const LoanSection: React.FC<Props> = ({
  values,
  onChange,
  onSubmit,
  items,
}) => {
  return (
    <div className="space-y-3">
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
          <label>Prazo (meses)</label>
          <input
            className="border p-1 ml-2"
            type="number"
            value={values.prazo}
            onChange={(e) => onChange({ prazo: e.target.value })}
          />
        </div>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          type="submit"
        >
          Solicitar
        </button>
      </form>

      <div className="border p-3 rounded space-y-1">
        {!items || items.length === 0 ? (
          <div>Nenhum empréstimo.</div>
        ) : (
          items.map((e, i) => (
            <div
              key={e.idEmprestimo || i}
              className="flex justify-between border-b py-1"
            >
              <span>
                R$ {e.valorSolicitado?.toFixed?.(2) ?? e.valorSolicitado}
              </span>
              <span>{e.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoanSection;
