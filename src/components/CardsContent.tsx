import React from "react";
import type { Cartao } from "../types";
import { formatCurrency } from "../utils/formatters";

interface CardsContentProps {
  cartoes: Cartao[];
  onEmitir: () => void;
  onBloquear: (numeroCartao: number) => void;
  onDesbloquear: (numeroCartao: number) => void;
}

const CardsContent: React.FC<CardsContentProps> = ({
  cartoes,
  onEmitir,
  onBloquear,
  onDesbloquear,
}) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cartões</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <button
            onClick={onEmitir}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium transition"
          >
            Emitir Novo Cartão
          </button>
        </div>

        {/* Lista de cartões */}
        {cartoes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum cartão emitido</p>
            <p className="text-gray-400 text-sm mt-2">
              Clique em "Emitir Novo Cartão" para criar um
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartoes.map((cartao, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-5 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">TIPO</p>
                    <p className="font-bold text-gray-800 text-lg">
                      {cartao.tipoCartao === "DEBITO"
                        ? "Débito"
                        : cartao.tipoCartao === "CREDITO"
                          ? "Crédito"
                          : "Pré-pago"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${
                      cartao.status === "ATIVO"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {cartao.status === "ATIVO" ? "Ativo" : "Bloqueado"}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">NÚMERO</p>
                  <p className="text-lg font-mono text-gray-800">
                    **** **** **** {cartao.numeroCartao
                      .toString()
                      .slice(-4)}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-600 mb-1">LIMITE</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatCurrency(cartao.limite)}
                  </p>
                </div>

                <div className="flex gap-2">
                  {cartao.status === "ATIVO" ? (
                    <button
                      onClick={() =>
                        onBloquear(cartao.numeroCartao as number)
                      }
                      className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 font-medium transition"
                    >
                      Bloquear
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        onDesbloquear(cartao.numeroCartao as number)
                      }
                      className="flex-1 px-3 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 font-medium transition"
                    >
                      Desbloquear
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardsContent;
