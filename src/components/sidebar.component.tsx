import { useState, useMemo, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  PanelLeftClose,
  PanelLeft,
  FileText,
  Trash2,
  Pencil,
  MoreHorizontal,
  Mic,
  LogOut,
  ChevronDown,
} from "lucide-react";
import Cookies from "js-cookie";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useBoard } from "@/provider/board.context";
import { useAuth } from "@/provider/auth.context";
import { DialogTranscription } from "@/components/dialogTranscription";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-100 ${className ?? ""}`} />
);

const UserAvatar = ({ src, name }: { src?: string; name?: string }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name?.charAt(0).toUpperCase() ?? "U";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        onError={() => setImgError(true)}
        className="h-8 w-8 shrink-0 rounded-full border border-slate-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-200 bg-violet-50">
      <span className="text-[13px] font-bold text-violet-600">{initial}</span>
    </div>
  );
};

export const SiderBarComponent = () => {
  const {
    boards,
    board,
    getBoard,
    getAllBoard,
    createBoard,
    renameBoard,
    deleteBoard,
  } = useBoard();
  const { user, userLoading, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const userMenuRef = useRef<HTMLDivElement>(null);
  // Evita guardar dos veces (Enter + blur) o guardar tras cancelar con Esc
  const renameDoneRef = useRef(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const activeBoardId = board?.id ?? Cookies.get("boardId");

  const filteredBoards = useMemo(() => {
    if (!boards) return [];
    if (!query.trim()) return boards;
    return boards.filter((b) =>
      b.title.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [boards, query]);

  // Carga la lista de pizarras al montar el sidebar
  useEffect(() => {
    getAllBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      )
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectBoard = (boardId: string) => {
    if (boardId === activeBoardId) return;
    Cookies.set("boardId", boardId);
    getBoard(boardId);
  };

  const handleCreateBoard = async () => {
    const newBoard = await createBoard();
    if (newBoard?.id) {
      Cookies.set("boardId", newBoard.id);
      await getAllBoard();
    }
  };

  const handleDeleteBoard = async (e: React.MouseEvent, boardId: string) => {
    e.stopPropagation();
    setOpenMenuId(null);

    try {
      await deleteBoard(boardId);
    } catch (error) {
      console.error("Error al eliminar el board:", error);
    }
  };

  const startRename = (
    e: React.MouseEvent,
    b: { id: string; title: string },
  ) => {
    e.stopPropagation();
    setOpenMenuId(null);
    renameDoneRef.current = false;
    setEditingId(b.id);
    setEditingTitle(b.title);
  };

  const commitRename = async () => {
    if (renameDoneRef.current || !editingId) return;
    renameDoneRef.current = true;

    const id = editingId;
    const title = editingTitle;
    setEditingId(null);

    try {
      await renameBoard(id, title);
    } catch (error) {
      console.error("Error al renombrar:", error);
    }
  };

  const cancelRename = () => {
    renameDoneRef.current = true;
    setEditingId(null);
  };

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  const stopListening = () => SpeechRecognition.stopListening();
  const handleTranscriptSubmit = (message: string) => console.log(message);
  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  return (
    <>
      <aside
        className={`flex h-screen flex-col border-r border-[#e2e8f0] bg-white transition-[width] duration-200 ease-out ${
          collapsed ? "w-[64px]" : "w-[260px]"
        }`}
      >
        {/* HEADER */}
        <div className="flex h-14 items-center justify-between px-3">
          {!collapsed && (
            <span className="px-2 text-[15px] font-semibold tracking-tight text-gray-900">
              Sketra
            </span>
          )}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label={
              collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"
            }
          >
            {collapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
          </button>
        </div>

        {/* NEW BOARD */}
        <div className="px-3 pb-2">
          <button
            onClick={handleCreateBoard}
            className={`flex items-center gap-2 rounded-lg bg-[#6965db] text-white shadow-sm transition-all hover:bg-[#5b57cf] active:scale-[0.98] ${
              collapsed ? "h-9 w-9 justify-center" : "h-9 w-full px-3"
            }`}
          >
            <Plus size={16} strokeWidth={2.5} />
            {!collapsed && (
              <span className="text-[13px] font-medium">Nueva pizarra</span>
            )}
          </button>
        </div>

        {/* SEARCH */}
        {!collapsed && (
          <div className="px-3 pb-3">
            <div className="flex h-8 items-center gap-2 rounded-md border border-[#e2e8f0] bg-[#f8f9fa] px-2.5 focus-within:border-[#6965db]/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#6965db]/10">
              <Search size={14} className="shrink-0 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar pizarras"
                className="w-full bg-transparent text-[13px] text-gray-700 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        )}

        {/* BOARD LIST */}
        <div className="flex-1 overflow-y-auto px-2">
          {!collapsed && (
            <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Pizarras
            </div>
          )}

          <nav className="flex flex-col gap-0.5">
            {filteredBoards.length === 0 && !collapsed && (
              <p className="px-3 py-2 text-[13px] text-gray-400">
                Sin pizarras aún
              </p>
            )}

            {filteredBoards.map((b) => {
              const isActive = b.id === activeBoardId;
              return (
                <div
                  key={b.id}
                  onClick={() => handleSelectBoard(b.id)}
                  className={`group relative flex cursor-pointer items-center gap-2 rounded-md text-[13px] transition-colors ${
                    collapsed ? "h-9 w-9 justify-center" : "h-9 px-2.5"
                  } ${
                    isActive
                      ? "bg-[#6965db]/10 text-[#6965db]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <FileText
                    size={15}
                    className={`shrink-0 ${
                      isActive ? "text-[#6965db]" : "text-gray-400"
                    }`}
                  />

                  {!collapsed && (
                    <>
                      {editingId === b.id ? (
                        <input
                          autoFocus
                          value={editingTitle}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={commitRename}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename();
                            if (e.key === "Escape") cancelRename();
                          }}
                          className="min-w-0 flex-1 rounded border border-[#6965db]/40 bg-white px-1 text-[13px] text-gray-700 outline-none"
                        />
                      ) : (
                        <span
                          className="flex-1 truncate"
                          onDoubleClick={(e) => startRename(e, b)}
                        >
                          {b.title}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === b.id ? null : b.id);
                        }}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-gray-400 opacity-0 transition-opacity hover:bg-gray-200 hover:text-gray-700 group-hover:opacity-100 ${
                          openMenuId === b.id ? "opacity-100" : ""
                        }`}
                      >
                        <MoreHorizontal size={14} />
                      </button>

                      {openMenuId === b.id && (
                        <div
                          onMouseLeave={() => setOpenMenuId(null)}
                          className="absolute right-0 top-9 z-10 w-36 overflow-hidden rounded-lg border border-[#e2e8f0] bg-white py-1 shadow-lg"
                        >
                          <button
                            onClick={(e) => startRename(e, b)}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-gray-700 hover:bg-gray-100"
                          >
                            <Pencil size={13} />
                            Renombrar
                          </button>
                          <button
                            onClick={(e) => handleDeleteBoard(e, b.id)}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* FOOTER: IA + USUARIO */}
        <div className="border-t border-[#e2e8f0] p-2">
          {/* Hablar con IA */}
          {browserSupportsSpeechRecognition && (
            <button
              onClick={() => {
                resetTranscript();
                setDialogOpen(true);
              }}
              className={`mb-1 flex items-center gap-2 rounded-lg border border-[#e2e8f0] bg-white transition-all hover:border-violet-200 hover:bg-violet-50 ${
                collapsed ? "h-9 w-9 justify-center" : "h-9 w-full px-2.5"
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6965db] text-white">
                <Mic size={13} strokeWidth={2.5} />
              </div>
              {!collapsed && (
                <span className="text-[13px] font-semibold text-slate-600">
                  Hablar con IA
                </span>
              )}
            </button>
          )}

          {/* Usuario */}
          <div className="relative" ref={userMenuRef}>
            {userLoading ? (
              <div
                className={`flex items-center gap-2 px-1 ${collapsed ? "justify-center" : ""}`}
              >
                <Skeleton className="h-7 w-7 rounded-full" />
                {!collapsed && (
                  <>
                    <Skeleton className="h-2.5 w-20 rounded" />
                    <Skeleton className="h-2.5 w-2.5 rounded" />
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className={`flex items-center gap-2 rounded-lg border transition-all ${
                  userMenuOpen
                    ? "border-violet-300 bg-violet-50"
                    : "border-transparent hover:bg-gray-100"
                } ${collapsed ? "h-9 w-9 justify-center" : "h-10 w-full px-1.5"}`}
              >
                <UserAvatar src={user?.avatar} name={user?.name} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-left text-[13px] font-semibold text-slate-700">
                      {user?.name ?? "Usuario"}
                    </span>
                    <ChevronDown
                      size={12}
                      strokeWidth={2.5}
                      className={`shrink-0 text-slate-400 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </>
                )}
              </button>
            )}

            {/* Dropdown (se abre hacia arriba porque el sidebar vive abajo) */}
            {userMenuOpen && !userLoading && (
              <div
                className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-60 overflow-hidden rounded-xl border border-slate-200 bg-white"
                style={{
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05)",
                }}
              >
                <div className="border-b border-slate-100 bg-slate-50 px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <UserAvatar src={user?.avatar} name={user?.name} />
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-slate-800">
                        {user?.name ?? "Usuario"}
                      </p>
                      <p className="truncate text-[11px] text-slate-400">
                        {user?.email ?? ""}
                      </p>
                    </div>
                    <span className="ml-auto shrink-0 rounded-md border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-bold text-violet-600">
                      Free
                    </span>
                  </div>
                </div>

                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all hover:bg-red-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white transition-all group-hover:border-red-200 group-hover:bg-red-50">
                      <LogOut
                        size={13}
                        strokeWidth={2}
                        className="text-slate-400 transition-colors group-hover:text-red-500"
                      />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-600 transition-colors group-hover:text-red-600">
                        Cerrar sesión
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {user?.email ?? ""}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {dialogOpen && (
        <DialogTranscription
          open={dialogOpen}
          setOpen={setDialogOpen}
          transcript={transcript}
          listening={listening}
          resetTranscript={resetTranscript}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSubmit={handleTranscriptSubmit}
        />
      )}
    </>
  );
};
