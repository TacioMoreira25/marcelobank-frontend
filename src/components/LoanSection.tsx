import React, { useMemo, useState } from "react";
import { formatCurrency } from "../utils/formatters";

type LoanItem = {
  idEmprestimo?: number | string;
  id?: number | string;
  valorSolicitado?: number | string;
  valorAprovado?: number | string;
  prazoMeses?: number | string;
  status?: string;
  taxaJuros?: number | string;
  saldoDevedor?: number | string;
};

type LoanFormValues = {
  valor: string;
  prazo: string;
};

type LoanSectionProps = {
  values?: LoanFormValues;
  onChange?: (patch: Partial<LoanFormValues>) => void;
  onSubmit?: (e?: React.MouseEvent | React.FormEvent) => void | Promise<void>;
  items?: LoanItem[];
  interestRate?: number;
  onPay?: (id: number, valor: number, pin: string) => Promise<void> | void;
};

const calcParcela = (
  principal: number | string,
  taxaMesPercent: number | string,
  n: number | string
): number => {
  const P = Number(principal) || 0;
  const nMeses = Number(n) || 0;
  const i = (Number(taxaMesPercent) || 0) / 100;
  if (!P || !nMeses) return 0;
  if (!i) return P / nMeses;
  const fator = Math.pow(1 + i, -nMeses);
  return (P * i) / (1 - fator);
};

const normalizeId = (v: unknown): number | undefined => {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
};

const LoanSection: React.FC<LoanSectionProps> = ({
  values = { valor: "", prazo: "12" },
  onChange = () => {},
  onSubmit = () => {},
  items = [],
  interestRate = 4.5,
  onPay = async () => {},
}) => {
  const [paying, setPaying] = useState<Record<number, boolean>>({});
  const [payModal, setPayModal] = useState<{
    open: boolean;
    id?: number;
    valor?: string;
  }>({ open: false });
  const [pin, setPin] = useState("");

  const taxaLabel = useMemo(
    () => `${interestRate.toFixed(1)}% a.m.`,
    [interestRate]
  );

  const openPayModal = (id: number, parcela: number) => {
    const raw = parcela ? parcela.toFixed(2) : "";
    setPayModal({ open: true, id, valor: raw });
    setPin("");
  };

  const confirmPay = async () => {
    const id = payModal.id;
    if (id == null) return;
    const norm = String(payModal.valor || "").replace(/,/g, ".");
    const valor = parseFloat(norm);
    if (!valor || valor <= 0 || isNaN(valor)) {
      alert("Informe um valor válido para pagamento");
      return;
    }
    if (!pin || pin.length < 4) {
      alert("PIN inválido");
      return;
    }
    setPaying((s) => ({ ...s, [id]: true }));
    try {
      await onPay(id, valor, pin);
      setPayModal({ open: false });
      setPin("");
    } catch (error) {
      console.error("Erro ao pagar:", error);
    } finally {
      setPaying((s) => ({ ...s, [id]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APROVADO":
        return <span className="text-emerald-600 font-bold">✓</span>;
      case "EM_ATRASO":
        return <span className="text-amber-600 font-bold">!</span>;
      case "LIQUIDADO":
        return <span className="text-slate-600 font-bold">✓</span>;
      default:
        return <span className="text-gray-600 font-bold">○</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      APROVADO: "bg-emerald-100 text-emerald-800",
      EM_ATRASO: "bg-amber-100 text-amber-800",
      LIQUIDADO: "bg-slate-100 text-slate-800",
    };
    return badges[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* CARD DE TAXA */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-5 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-lg">○</span>
            </div>
            <div>
              <div className="text-sm opacity-90">Taxa de juros</div>
              <div className="text-2xl font-bold">{taxaLabel}</div>
            </div>
          </div>
          <div className="text-xs opacity-90 text-right">
            Parcela estimada = Tabela Price (aprox.)
          </div>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Solicitar Novo Empréstimo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor (R$)
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={values.valor}
              onChange={(e) => onChange({ valor: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prazo (meses)
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              type="number"
              min="1"
              max="360"
              value={values.prazo}
              onChange={(e) => onChange({ prazo: e.target.value })}
            />
          </div>
          <div className="flex items-end">
            <button
              className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md transition"
              onClick={onSubmit}
              type="button"
            >
              Solicitar
            </button>
          </div>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Meus Empréstimos
          </h3>
        </div>

        {!items || items.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <span className="text-gray-400 text-xl">○</span>
            </div>
            <p className="text-gray-500 font-medium">Nenhum empréstimo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Valor Solicitado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Valor Aprovado
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Prazo (meses)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Taxa
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Parcela Estimada
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Total a Pagar (est.)
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Saldo Devedor
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((e: LoanItem, i: number) => {
                  const solicitado = Number(e.valorSolicitado || 0);
                  const aprovado = Number(e.valorAprovado || 0);
                  const prazo = Number(e.prazoMeses || 0);
                  const status = e.status || "";
                  const taxa = e.taxaJuros ?? interestRate;
                  const parcela = aprovado
                    ? calcParcela(aprovado, taxa, prazo)
                    : 0;
                  const totalPagar = parcela && prazo ? parcela * prazo : 0;

                  const idNormalized =
                    normalizeId(e.idEmprestimo) ?? normalizeId(e.id);
                  const key = idNormalized ?? i;

                  const hasId =
                    idNormalized !== undefined && idNormalized !== null;
                  const canPay =
                    hasId && status !== "LIQUIDADO" && aprovado > 0;

                  return (
                    <tr
                      key={key}
                      className="border-b border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {solicitado ? formatCurrency(solicitado) : "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {aprovado ? formatCurrency(aprovado) : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {prazo || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {`${Number(taxa).toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {parcela ? formatCurrency(parcela) : "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {totalPagar ? formatCurrency(totalPagar) : "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-red-600">
                        {e.saldoDevedor !== undefined
                          ? formatCurrency(Number(e.saldoDevedor))
                          : "-"}
                        {canPay && (
                          <div className="mt-2">
                            <button
                              className="px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-sm"
                              onClick={() => {
                                if (
                                  idNormalized === undefined ||
                                  idNormalized === null
                                ) {
                                  alert(
                                    "Não foi possível identificar o empréstimo para pagamento."
                                  );
                                  return;
                                }
                                openPayModal(idNormalized, parcela);
                              }}
                              type="button"
                            >
                              Pagar
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            status
                          )}`}
                        >
                          {getStatusIcon(status)}
                          {status}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td
                    className="px-4 py-3 text-gray-700 font-semibold"
                    colSpan={6}
                  >
                    Total em aberto
                  </td>
                  <td className="px-4 py-3 font-semibold text-red-600">
                    {formatCurrency(
                      items.reduce(
                        (acc, cur) => acc + Number(cur.saldoDevedor || 0),
                        0
                      )
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
      {/* Modal de Pagamento */}
      {payModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm border border-pink-200">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h4 className="text-base font-semibold text-gray-800">
                Pagar parcela
              </h4>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setPayModal({ open: false })}
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Valor (R$)
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  type="number"
                  step="0.01"
                  min="0"
                  value={payModal.valor || ""}
                  onChange={(e) =>
                    setPayModal((m) => ({ ...m, valor: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  PIN
                </label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Digite seu PIN"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      confirmPay();
                    }
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex gap-2">
              <button
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium text-sm transition disabled:opacity-50"
                onClick={confirmPay}
                disabled={payModal.id != null && Boolean(paying[payModal.id])}
              >
                {payModal.id != null && paying[payModal.id]
                  ? "Confirmando..."
                  : "Confirmar"}
              </button>
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium text-sm transition"
                onClick={() => setPayModal({ open: false })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

LoanSection.displayName = "LoanSection";

export default LoanSection;
