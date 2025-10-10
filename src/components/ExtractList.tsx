import React from "react";
import type { Transacao } from "../types";
import { formatCurrency } from "../utils/formatters";

interface Props {
  items: Transacao[];
  currentAccount?: number;
}

const ExtractList: React.FC<Props> = ({ items, currentAccount }) => {
  if (!items || items.length === 0)
    return (
      <div className="border p-4 rounded bg-white">Nenhuma transação.</div>
    );
  return (
    <div className="border p-4 rounded bg-white divide-y">
      {items.map((t, i) => {
        const asRec = t as unknown as Record<string, unknown>;
        const getStr = (keys: string[]): string => {
          for (const k of keys) {
            const v = asRec[k];
            if (typeof v === "string" && v.trim()) return v.trim();
          }
          return "";
        };
        const getNum = (keys: string[]): number | undefined => {
          for (const k of keys) {
            const v = asRec[k];
            if (typeof v === "number" && Number.isFinite(v)) return v;
            if (typeof v === "string") {
              const n = parseFloat(v);
              if (Number.isFinite(n)) return n;
            }
          }
          return undefined;
        };

        const tipoRaw = getStr(["tipoTransacao", "tipo"]);
        const descRaw = (t.descricao || "").trim();

        const getContaNumero = (
          c: Transacao["contaOrigem"]
        ): number | undefined => {
          if (typeof c === "number") return c;
          if (typeof c === "string") {
            const n = parseInt(c, 10);
            return Number.isFinite(n) ? n : undefined;
          }
          if (c && typeof c === "object" && "numeroConta" in c) {
            const n = (c as { numeroConta?: unknown }).numeroConta;
            return typeof n === "number" ? n : undefined;
          }
          return undefined;
        };

        const origem = getContaNumero(t.contaOrigem);
        const destino = getContaNumero(t.contaDestino);

        // Mapeia por campos quando possível
        // Prioriza o tipo vindo do backend
        // Normaliza tipo vindo do backend (se existir)
        const normalizeTipo = (v: string): string => {
          const up = v.toUpperCase();
          if (up.includes("DEPOSI")) return "Depósito";
          if (up.includes("SAQUE")) return "Saque";
          if (up.includes("TRANSFER")) return "Transferência";
          return v || "";
        };

        let computedTipo = tipoRaw ? normalizeTipo(tipoRaw) : "";
        if (!computedTipo && origem && destino) {
          if (currentAccount && origem === currentAccount) {
            computedTipo = "Transferência Enviada";
          } else if (currentAccount && destino === currentAccount) {
            computedTipo = "Transferência Recebida";
          } else {
            computedTipo = "Transferência";
          }
        } else if (!computedTipo && !origem && destino) {
          computedTipo = "Depósito";
        } else if (!computedTipo && origem && !destino) {
          computedTipo = "Saque";
        }

        // Se ainda não conseguiu, tenta pelo tipoRaw/descricao
        if (!computedTipo) {
          const raw = tipoRaw.toUpperCase();
          const dsc = descRaw.toUpperCase();
          if (raw.includes("DEPOSI") || dsc.includes("DEPOSI"))
            computedTipo = "Depósito";
          else if (raw.includes("SAQUE") || dsc.includes("SAQUE"))
            computedTipo = "Saque";
          else if (raw.includes("TRANSFER") || dsc.includes("TRANSFER"))
            computedTipo = "Transferência";
          else computedTipo = "Transação";
        }

        const tipoUpper = computedTipo.toUpperCase();

        // Ajuste visual de status (ex.: CONCLUIDA -> CONCLUÍDA)
        const rawStatus = ((t.status as string) || "").toUpperCase();
        const statusMap: Record<string, string> = {
          CONCLUIDA: "CONCLUÍDA",
        };
        const statusLabel = statusMap[rawStatus] || rawStatus || "";

        // Data em ISO (YYYY-MM-DD)
        let dataIso = "";
        const dataRaw = getStr(["dataTransacao", "data"]);
        if (dataRaw) {
          dataIso = /^\d{4}-\d{2}-\d{2}/.test(dataRaw)
            ? dataRaw.slice(0, 10)
            : new Date(dataRaw).toISOString().slice(0, 10);
        }

        // Crédito/Débito relativo à conta atual
        let isCredit =
          (!!currentAccount && destino === currentAccount) ||
          (!origem && !!destino); // depósitos entram
        let isDebit =
          (!!currentAccount && origem === currentAccount) ||
          (!!origem && !destino); // saques saem

        // Fallback por tipo quando origem/destino não vierem
        if (!origem && !destino) {
          if (tipoUpper.includes("DEPOSI")) isCredit = true;
          if (tipoUpper.includes("SAQUE")) isDebit = true;
        }

        const valorNum = getNum(["valor"]) ?? 0;
        const valorAbs = Math.abs(valorNum || 0);
        const valorFmt = formatCurrency(valorAbs);
        const sign = isCredit ? "+" : isDebit ? "-" : "";
        const valueColor = isCredit
          ? "text-green-600"
          : isDebit
          ? "text-red-600"
          : "text-gray-800";

        const origemStr = origem ? String(origem) : "-";
        const destinoStr = destino ? String(destino) : "-";
        return (
          <div
            key={t.idTransacao || i}
            className="py-3 flex items-center justify-between"
          >
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-semibold">tipo:</span> {tipoUpper}
              </div>
              {statusLabel && (
                <div>
                  <span className="font-semibold">status:</span> {statusLabel}
                </div>
              )}
              {dataIso && (
                <div>
                  <span className="font-semibold">data:</span> {dataIso}
                </div>
              )}
              <div className="text-xs text-gray-500">
                <span className="font-semibold">contas:</span> {origemStr} →{" "}
                {destinoStr}
              </div>
            </div>
            <div className="text-right text-gray-800">
              <div className="text-xs text-gray-500">valor</div>
              <div className={`font-medium ${valueColor}`}>
                {sign}
                {valorFmt}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExtractList;
