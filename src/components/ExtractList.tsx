import React from "react";
import type { Transacao } from "../types";

interface Props {
  items: Transacao[];
}

const ExtractList: React.FC<Props> = ({ items }) => {
  if (!items || items.length === 0)
    return <div className="border p-3 rounded">Nenhuma transação.</div>;
  return (
    <div className="border p-3 rounded space-y-2">
      {items.map((t, i) => (
        <div
          key={t.idTransacao || i}
          className="flex justify-between border-b py-1"
        >
          <span>{t.tipoTransacao}</span>
          <span>R$ {t.valor?.toFixed?.(2) ?? t.valor}</span>
        </div>
      ))}
    </div>
  );
};

export default ExtractList;
