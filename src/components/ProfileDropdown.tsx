import React, { useEffect, useMemo, useState } from "react";
import type { ClienteCompleto, Cliente } from "../types";
import { contaService } from "../services/contaService";
import { clienteService } from "../services/clienteService";

interface ProfileDropdownProps {
  cliente: ClienteCompleto;
  numeroConta?: number;
  onEdit?: () => void;
  onLogout?: () => void;
  onContaCreated?: () => void;
  onSwitchAccount?: (numeroConta: number) => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  cliente,
  numeroConta,
  onEdit,
  onLogout,
  onContaCreated,
  onSwitchAccount,
}) =>
  {
  const pessoaInicial = useMemo(() => {
    const nested = cliente.cliente;
    let cpfLS = "";
    let nomeLS = "";
    try {
      cpfLS = localStorage.getItem("clienteCpf") || "";
      const raw =
        localStorage.getItem("clienteData") ||
        localStorage.getItem("loginData");
      if (raw) {
        const js = JSON.parse(raw);
        nomeLS = js?.nomeCliente || js?.nome || "";
      }
    } catch {
      // ignore localStorage parse errors
    }
    return {
      nome: nested?.nome ?? cliente.nome ?? nomeLS ?? "",
      cpf: nested?.cpf ?? cliente.cpf ?? cpfLS ?? "",
      email: nested?.email ?? cliente.email ?? "",
      telefone: nested?.telefone ?? cliente.telefone ?? "",
      dataNascimento: nested?.dataNascimento ?? cliente.dataNascimento ?? "",
      endereco: nested?.endereco ?? cliente.endereco ?? "",
    };
  }, [cliente]);

  const [pessoa, setPessoa] = useState(pessoaInicial);

  useEffect(() => {
    setPessoa(pessoaInicial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pessoaInicial.cpf,
    pessoaInicial.nome,
    pessoaInicial.email,
    pessoaInicial.telefone,
    pessoaInicial.endereco,
    pessoaInicial.dataNascimento,
  ]);

  useEffect(() => {
    const precisa =
      !pessoa.nome || !pessoa.email || !pessoa.telefone || !pessoa.endereco;
    if (!pessoa.cpf || !precisa) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await clienteService.buscarPorCpf(pessoa.cpf);
        const c: Cliente = (resp?.data as Cliente) || ({} as Cliente);
        if (cancelled) return;
        setPessoa((prev) => ({
          ...prev,
          nome: prev.nome || c.nome || "",
          email: prev.email || c.email || "",
          telefone: prev.telefone || c.telefone || "",
          endereco: prev.endereco || c.endereco || "",
          dataNascimento: prev.dataNascimento || c.dataNascimento || "",
        }));
      } catch {
        // silencioso: se falhar, mantém como está
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    pessoa.cpf,
    pessoa.nome,
    pessoa.email,
    pessoa.telefone,
    pessoa.endereco,
    pessoa.dataNascimento,
  ]);

  const contas = cliente.contas;
  const contaAtual = numeroConta
    ? contas?.find((x) => x.numeroConta === numeroConta)
    : contas?.[0];

  const deriveTipoLabel = (rawVal: unknown): string => {
    if (!rawVal) return "-";
    const s = String(rawVal).toUpperCase();
    if (s.includes("CORREN")) return "Corrente";
    if (s.includes("POUP")) return "Poupança";
    if (s === "C" || s === "CC") return "Corrente";
    if (s === "P" || s === "CP") return "Poupança";
    return s.charAt(0) + s.slice(1).toLowerCase();
  };

  const getDeep = (obj: unknown, path: string[]): unknown => {
    let cur: unknown = obj;
    for (const key of path) {
      if (!cur || typeof cur !== "object") return undefined;
      const rec = cur as Record<string, unknown>;
      cur = rec[key];
    }
    return cur;
  };

  const tipoLocal = useMemo(() => {
    if (!contaAtual) return "-";
    const raw =
      getDeep(contaAtual, ["tipoConta"]) ??
      getDeep(contaAtual, ["tipo"]) ??
      getDeep(contaAtual, ["tipo_conta"]) ??
      getDeep(contaAtual, ["tipo", "nome"]) ??
      getDeep(contaAtual, ["tipoConta", "nome"]);
    return deriveTipoLabel(raw);
  }, [contaAtual]);

  const [tipoContaLabel, setTipoContaLabel] = useState<string>(tipoLocal);

  useEffect(() => {
    setTipoContaLabel(tipoLocal);
  }, [tipoLocal]);

  useEffect(() => {
    if (tipoLocal !== "-" || !numeroConta) return;
    let cancelled = false;
    (async () => {
      try {
        const resp = await contaService.buscarPorNumero(numeroConta);
        const data = resp?.data as unknown as
          | Record<string, unknown>
          | undefined;
        const raw =
          (data && (data["tipoConta"] ?? data["tipo"])) ??
          (data && getDeep(data, ["tipo", "nome"])) ??
          (data && getDeep(data, ["tipoConta", "nome"])) ??
          undefined;
        if (!cancelled) setTipoContaLabel(deriveTipoLabel(raw));
      } catch {
        // silencio: mantém '-'
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tipoLocal, numeroConta]);

  const [showEditPerfil, setShowEditPerfil] = useState(false);
  const [showCreateConta, setShowCreateConta] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editForm, setEditForm] = useState({
    nome: pessoa.nome,
    email: pessoa.email,
    telefone: pessoa.telefone,
    endereco: pessoa.endereco,
  });
  const [novaContaPin, setNovaContaPin] = useState("");
  const [novaContaTipo, setNovaContaTipo] = useState("CORRENTE");

  const handleEditPerfil = async () => {
    setLoading(true);
    try {
      if (!pessoa.cpf) throw new Error("CPF não encontrado");
      const payload: {
        nome?: string;
        email?: string;
        telefone?: string;
        endereco?: string;
      } = {};
      if (editForm.nome && editForm.nome !== pessoa.nome)
        payload.nome = editForm.nome;
      if (editForm.email && editForm.email !== pessoa.email)
        payload.email = editForm.email;
      if (editForm.telefone && editForm.telefone !== pessoa.telefone)
        payload.telefone = editForm.telefone;
      if (editForm.endereco && editForm.endereco !== pessoa.endereco)
        payload.endereco = editForm.endereco;

      if (Object.keys(payload).length === 0) {
        alert("Nada para atualizar");
        setShowEditPerfil(false);
        return;
      }

      await clienteService.atualizar(pessoa.cpf, payload);
      alert("Perfil atualizado com sucesso!");
      setShowEditPerfil(false);
      onEdit?.();
    } catch (error) {
      alert("Erro ao atualizar perfil");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConta = async () => {
    if (!novaContaPin || novaContaPin.length < 4) {
      alert("PIN deve ter no mínimo 4 dígitos");
      return;
    }
    if (!pessoa.cpf) {
      alert("CPF não encontrado");
      return;
    }
    setLoading(true);
    try {
      await contaService.criarConta({
        cpf: pessoa.cpf,
        tipoConta: novaContaTipo as "CORRENTE" | "POUPANCA",
        pin: novaContaPin,
        saldoInicial: 0,
      });
      alert("Conta criada com sucesso!");
      setNovaContaPin("");
      setNovaContaTipo("CORRENTE");
      setShowCreateConta(false);
      onContaCreated?.();
    } catch (error) {
      alert("Erro ao criar conta");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-t-lg">
        <p className="text-lg font-bold">{pessoa.nome || "-"}</p>
        <p className="text-sm text-pink-100">{pessoa.cpf || "-"}</p>
      </div>

      {!showEditPerfil && !showCreateConta && (
        <div className="p-4 space-y-4 border-b border-gray-200">
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-2">
              SEUS DADOS
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500 text-xs">Nome</div>
                <div className="text-gray-800 font-medium break-words">
                  {pessoa.nome || "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">CPF</div>
                <div className="text-gray-800 font-medium">
                  {pessoa.cpf || "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Email</div>
                <div className="text-gray-800 font-medium break-words">
                  {pessoa.email || "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Telefone</div>
                <div className="text-gray-800 font-medium">
                  {pessoa.telefone || "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Nascimento</div>
                <div className="text-gray-800 font-medium">
                  {pessoa.dataNascimento || "-"}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-gray-500 text-xs">Endereço</div>
                <div className="text-gray-800 font-medium break-words">
                  {pessoa.endereco || "-"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold mb-2">
              CONTA ATUAL
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500 text-xs">Número</div>
                <div className="text-gray-800 font-medium">
                  {numeroConta ?? contas?.[0]?.numeroConta ?? "-"}
                </div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Tipo</div>
                <div className="text-gray-800 font-medium">
                  {tipoContaLabel}
                </div>
              </div>
            </div>
          </div>

          {Array.isArray(contas) && contas.length > 1 && (
            <div>
              <p className="text-xs text-gray-600 font-semibold mb-2">
                MINHAS CONTAS
              </p>
              <div className="space-y-2">
                {contas.map((c, idx) => {
                  const isAtiva =
                    (numeroConta ?? contas?.[0]?.numeroConta) === c.numeroConta;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                        isAtiva
                          ? "border-pink-300 bg-pink-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="text-sm">
                        <div className="font-medium text-gray-800">
                          {c.numeroConta}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {(() => {
                            const rawObj = c as unknown as {
                              tipoConta?: unknown;
                              tipo?: unknown;
                            };
                            const raw = rawObj.tipoConta ?? rawObj.tipo;
                            return deriveTipoLabel(raw);
                          })()}
                        </div>
                      </div>
                      {!isAtiva && (
                        <button
                          className="text-xs px-3 py-1 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                          onClick={() => {
                            try {
                              localStorage.setItem(
                                "numeroConta",
                                String(c.numeroConta)
                              );
                            } catch (err) {
                              console.debug(
                                "Falha ao persistir numeroConta:",
                                err
                              );
                            }
                            onSwitchAccount?.(c.numeroConta as number);
                          }}
                        >
                          Usar
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {!showEditPerfil && !showCreateConta && (
        <div className="p-3 space-y-2">
          <button
            onClick={() => {
              setEditForm({
                nome: pessoa.nome || "",
                email: pessoa.email || "",
                telefone: pessoa.telefone || "",
                endereco: pessoa.endereco || "",
              });
              setShowEditPerfil(true);
            }}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
          >
            Editar Perfil
          </button>
          <button
            onClick={() => setShowCreateConta(true)}
            className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
          >
            Criar Nova Conta
          </button>
          <button
            onClick={async () => {
              try {
                const numero = numeroConta ?? contas?.[0]?.numeroConta;
                if (!numero) {
                  alert("Número da conta não encontrado");
                  return;
                }
                const ok = window.confirm(
                  `Tem certeza que deseja deletar a conta ${numero}? Esta ação é irreversível.`
                );
                if (!ok) return;
                await contaService.deletarConta(numero);
                alert("Conta deletada com sucesso.");
                onLogout?.();
              } catch (e) {
                console.error(e);
                alert("Erro ao deletar conta");
              }
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
          >
            Deletar Conta
          </button>
        </div>
      )}

      {showEditPerfil && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Editar Perfil</h3>
            <button
              onClick={() => setShowEditPerfil(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Nome
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={editForm.nome}
                onChange={(e) =>
                  setEditForm({ ...editForm, nome: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={editForm.telefone}
                onChange={(e) =>
                  setEditForm({ ...editForm, telefone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Endereço
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={editForm.endereco}
                onChange={(e) =>
                  setEditForm({ ...editForm, endereco: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleEditPerfil}
                disabled={loading}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg font-medium text-sm transition disabled:opacity-50"
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setShowEditPerfil(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateConta && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Criar Nova Conta</h3>
            <button
              onClick={() => setShowCreateConta(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Tipo de Conta
              </label>
              <select
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={novaContaTipo}
                onChange={(e) => setNovaContaTipo(e.target.value)}
              >
                <option value="CORRENTE">Conta Corrente</option>
                <option value="POUPANCA">Poupança</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                PIN (mínimo 4 dígitos)
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={novaContaPin}
                onChange={(e) => setNovaContaPin(e.target.value)}
                placeholder="Digite seu PIN"
              />
            </div>
            <p className="text-xs text-gray-600">Saldo inicial: R$ 0,00</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateConta}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition disabled:opacity-50"
              >
                {loading ? "Criando..." : "Criar Conta"}
              </button>
              <button
                onClick={() => setShowCreateConta(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium text-sm transition"
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

export default ProfileDropdown;
