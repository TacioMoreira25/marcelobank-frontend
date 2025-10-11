import React, { useState } from "react";
import MBank from "../assets/LogoMB.png";
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
  const hasName = Boolean(nomeDisplay);

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={MBank} alt="MarceloBank" className="h-9" />
          <div className="font-bold text-pink-600 text-xl tracking-tight">
            MarceloBank
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowDropdown((v) => !v)}
            className="flex items-center gap-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition duration-200"
            title={hasName ? nomeDisplay : "Perfil"}
            aria-label={
              hasName ? `Abrir menu de ${nomeDisplay}` : "Abrir menu de perfil"
            }
          >
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm ring-1 ring-pink-200/60">
              {hasName ? (
                getInitials(nomeDisplay)
              ) : (
                <svg
                  className="w-5 h-5 text-white opacity-95"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.5 20.25a8.25 8.25 0 1115 0v.75H4.5v-.75z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800 leading-tight">
                {hasName ? nomeDisplay : "Perfil"}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-gray-500 transition duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
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
