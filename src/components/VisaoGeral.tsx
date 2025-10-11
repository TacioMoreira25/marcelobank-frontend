import React from "react";
import type { Transacao, Emprestimo, Cartao } from "../types";
import { formatCurrency } from "../utils/formatters";

interface Props {
  transacoes: Transacao[];
  emprestimos: Emprestimo[];
  cartoes: Cartao[];
  saldo: number;
}

const VisaoGeral: React.FC<Props> = ({
  transacoes,
  emprestimos,
  cartoes,
  saldo,
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Visão Geral</h1>

      <div className="bg-gradient-to-r from-pink-300 to-pink-700 text-white p-8 rounded-lg shadow-lg">
        <p className="text-pink-100 text-sm mb-2">Saldo Disponível</p>
        <h2 className="text-5xl font-bold">{formatCurrency(saldo)}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-300">
          <p className="text-gray-600 text-sm mb-2">Transações</p>
          <p className="text-3xl font-bold text-pink-300">
            {transacoes.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-400">
          <p className="text-gray-600 text-sm mb-2">Empréstimos</p>
          <p className="text-3xl font-bold text-pink-400">
            {emprestimos.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-pink-700">
          <p className="text-gray-600 text-sm mb-2">Cartões</p>
          <p className="text-3xl font-bold text-pink-700">{cartoes.length}</p>
        </div>
      </div>
    </div>
  );
};

VisaoGeral.displayName = "VisaoGeral";

export default VisaoGeral;
