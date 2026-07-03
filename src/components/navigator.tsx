import { Mic, LogOut, ChevronDown } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useState, useRef, useEffect } from "react";
import { DialogTranscription } from "@/components/dialogTranscription";
import { useAuth } from "@/provider/auth.provider";
import { useBoard } from "@/provider/board.provider";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-100 ${className}`} />
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
  const {board} = useBoard();

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="flex h-12 items-center px-4 text-xs text-slate-400">
        Este navegador no soporta reconocimiento de voz.
      </div>
    );
  }

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "es-ES" });
  const stopListening = () => SpeechRecognition.stopListening();
  const handleSubmit = (message: string) => console.log(message);
  const handleLogout = () => { setMenuOpen(false); logout(); };

  return (
    <>
      <header
        className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-bold tracking-tight text-slate-800">Appsy</span>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 py-1 pl-1.5 pr-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-xs text-white">
              <i className="ti ti-pencil" aria-hidden="true" />
            </div>
            <span className="text-xs font-bold text-violet-600">{board?.title || "Untitle"}</span>
          </div>
        </div>

        {/* Hablar con IA
        <button
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 transition-all hover:border-violet-200 hover:bg-violet-50"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Mic size={13} strokeWidth={2.5} />
          </div>
          <span className="text-xs font-semibold text-slate-600">Hablar con IA</span>
        </button> */}

        {/* User */}
        {/*  */}
      </header>

      {/* {dialogOpen && (
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
      )} */}
    </>
  );
};