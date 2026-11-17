import { useState, useRef, useEffect } from "react";
import { Mic, LogOut, ChevronDown } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { DialogTranscription } from "@/components/dialogTranscription";
import { useAuth } from "@/provider/auth.context";
import { useBoard } from "@/provider/board.context";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-100 ${className ?? ""}`} />
);

export const UserAvatar = ({ src, name }: { src?: string; name?: string }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name?.charAt(0).toUpperCase() ?? "U";

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name ?? "Avatar"}
        onError={() => setImgError(true)}
        className="h-7 w-7 rounded-full border border-slate-200 object-cover"
      />
    );
  }

  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-violet-200 bg-violet-50">
      <span className="text-[11px] font-bold text-violet-600">{initial}</span>
    </div>
  );
};

export const Nav = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, userLoading, logout } = useAuth();
  const { board } = useBoard();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  const stopListening = () => SpeechRecognition.stopListening();
  const handleSubmit = (message: string) => console.log(message);
  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <>
      <header
        className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-bold tracking-tight text-slate-800">
            Appsy
          </span>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 py-1 pl-1.5 pr-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-xs text-white">
              <i className="ti ti-pencil" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-violet-600">
              {board?.title || "Untitled"}
            </span>
          </div>
        </div>

        {/* Hablar con IA */}
        {browserSupportsSpeechRecognition ? (
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all hover:border-violet-200 hover:bg-violet-50"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600 text-white">
              <Mic size={13} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-semibold text-slate-600">
              Hablar con IA
            </span>
          </button>
        ) : (
          <span className="text-xs text-slate-400">
            Este navegador no soporta reconocimiento de voz.
          </span>
        )}

        {/* User */}
        <div className="relative" ref={menuRef}>
          {userLoading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg px-2 py-1 transition-all hover:bg-slate-50"
            >
              <UserAvatar src={user?.avatar} name={user?.name} />
              <span className="text-xs font-semibold text-slate-700">
                {user?.name}
              </span>
              <ChevronDown
                size={14}
                className={`text-slate-400 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {menuOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-500"
              >
                <LogOut size={13} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </header>

      {dialogOpen && (
        <DialogTranscription
          open={dialogOpen}
          setOpen={setDialogOpen}
          transcript={transcript}
          listening={listening}
          resetTranscript={resetTranscript}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};
