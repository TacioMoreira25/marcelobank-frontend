import React from "react";
import type { Cartao } from "../types";

interface Props {
  items: Cartao[];
  onEmitir: () => void;
  onBloquear: (numeroCartao: number) => void;
  onDesbloquear: (numeroCartao: number) => void;
}

const CardsSection: React.FC<Props> = ({
  items,
  onEmitir,
  onBloquear,
  onDesbloquear,
}) => {
  return (
    <div className="space-y-3">
      <button
        className="px-3 py-1 bg-purple-600 text-white rounded"
        onClick={onEmitir}
      >
        Emitir cartão débito
      </button>
      <div className="border p-3 rounded space-y-1">
        {!items || items.length === 0 ? (
          <div>Nenhum cartão.</div>
        ) : (
          items.map((c, i) => (
            <div
              key={c.numeroCartao || i}
              className="flex justify-between items-center border-b py-1"
            >
              <div>
                <div>
                  <b>Número:</b> {c.numeroCartao}
                </div>
                <div>
                  <b>Tipo:</b> {c.tipoCartao}
                </div>
                <div>
                  <b>Status:</b> {c.status}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => onBloquear(c.numeroCartao as number)}
                >
                  Bloquear
                </button>
                <button
                  className="px-2 py-1 bg-gray-200 rounded"
                  onClick={() => onDesbloquear(c.numeroCartao as number)}
                >
                  Desbloquear
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CardsSection;
