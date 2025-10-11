import React, { useState } from "react";
import MBank from "../assets/MBank.png";
import type { ClienteCompleto } from "../types";
import ProfileDropdown from "./ProfileDropdown";

interface Props {
  cliente: ClienteCompleto;
  numeroConta?: number;
  onEdit?: () => void;
  onLogout?: () => void;
  onContaCreated?: () => void;
  onSwitchAccount?: (numeroConta: number) => void;
}

const TopBar: React.FC<Props> = ({
  cliente,
  numeroConta,
  onEdit,
  onLogout,
  onContaCreated,
  onSwitchAccount,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const getInitials = (nome?: string) => {
    if (!nome) return "?";
    const parts = nome.split(" ");
    return (parts[0][0] + (parts[1]?.[0] || parts[0][1] || "")).toUpperCase();
  };

  const nomeDisplay = (cliente.cliente?.nome ?? cliente.nome ?? "").trim();

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={MBank} alt="MarceloBank" className="h-10" />
          <div className="font-bold text-pink-600 text-2xl">MarceloBank</div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full
             flex items-center justify-center text-white font-bold text-sm">
              {getInitials(nomeDisplay)}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">
                {nomeDisplay || "-"}
              </p>
              <p className="text-xs text-gray-600">
                {cliente.cliente?.cpf ?? cliente.cpf ?? "-"}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-600 transition ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showDropdown && (
            <ProfileDropdown
              cliente={cliente}
              numeroConta={numeroConta}
              onEdit={() => {
                setShowDropdown(false);
                onEdit?.();
              }}
              onLogout={() => {
                setShowDropdown(false);
                onLogout?.();
              }}
              onContaCreated={() => {
                setShowDropdown(false);
                onContaCreated?.();
              }}
              onSwitchAccount={(n) => {
                setShowDropdown(false);
                onSwitchAccount?.(n);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
