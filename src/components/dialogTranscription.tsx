import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent } from "@/component/ui/dialog";
import { Mic, Square, Sparkles, Loader2 } from "lucide-react";
import { iaApi } from "@/api/board";
import Cookies from "js-cookie";
import { useBoard } from "@/provider/board.provider";

interface DialogTranscriptionProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  transcript: string;
  listening: boolean;
  resetTranscript: () => void;
  onStartListening: () => void;
  onStopListening: () => void;
  onSubmit: (message: string) => void;
}

export const DialogTranscription: React.FC<DialogTranscriptionProps> = ({
  open,
  setOpen,
  transcript,
  listening,
  resetTranscript,
  onStartListening,
  onStopListening,
  onSubmit,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const {getBoard} = useBoard();  

  useEffect(() => {
    setMessage(transcript);
  }, [transcript]);

  const handleSend = async () => {
    const token: string = Cookies.get("token") || "";
    const boardId: string = Cookies.get("boardId") || "";
    if (!message.trim() || !token || !boardId || isSending) return;

    setIsSending(true);
    try {
      await iaApi(boardId, message, token);
      setMessage("");
      getBoard(boardId); // Refresh the board after sending the message
      resetTranscript();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isSending && setOpen(!open)}>
      <DialogContent className="max-w-[520px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-[15px] font-bold tracking-tight text-slate-800">
            Describe tu aplicación
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            {isSending ? "La IA está construyendo tu aplicación" : "Habla o escribe lo que quieres construir"}
          </p>
        </div>

        {/* Textarea / Loading state */}
        {isSending ? (
          <div className="flex min-h-[130px] flex-col items-center justify-center gap-3 rounded-lg border border-violet-100 bg-violet-50/50 p-3">
            <div className="relative flex h-11 w-11 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-20" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white shadow-md shadow-violet-200">
                <Sparkles size={16} className="animate-pulse" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin text-violet-500" strokeWidth={2.5} />
              <span className="text-[12px] font-semibold text-violet-600">
                Generando tu aplicación...
              </span>
            </div>
            <p className="max-w-[300px] text-center text-[11px] leading-relaxed text-slate-400">
              Esto puede tardar unos segundos, estamos armando la estructura y los componentes.
            </p>
          </div>
        ) : (
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ej: créame una app para gestión de tareas con login, tablero kanban y notificaciones..."
            className="w-full min-h-[130px] resize-none rounded-lg border border-slate-200 bg-white p-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
            }}
          />
        )}

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-2">

          <div className="flex items-center gap-2">
            {/* Mic */}
            <button
              onClick={listening ? onStopListening : onStartListening}
              disabled={isSending}
              aria-label={listening ? "Detener grabación" : "Activar micrófono"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all disabled:cursor-not-allowed disabled:opacity-40
                ${listening
                  ? "border-amber-300 bg-amber-50 text-amber-600 ring-2 ring-amber-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              {listening
                ? <Square size={13} strokeWidth={2.5} />
                : <Mic size={13} strokeWidth={2.5} />
              }
            </button>

            {/* Limpiar */}
            <button
              onClick={() => { resetTranscript(); setMessage(""); }}
              disabled={isSending}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Limpiar
            </button>
          </div>

          {/* Estado */}
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {listening && !isSending && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
            )}
            <span className={`text-[11px] ${listening && !isSending ? "font-semibold text-amber-600" : "text-slate-400"}`}>
              {isSending ? "" : listening ? "Escuchando..." : "Escribe o habla"}
            </span>
          </div>

          {/* Enviar */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-[13px] font-bold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {isSending && <Loader2 size={13} className="animate-spin" strokeWidth={2.5} />}
            {isSending ? "Generando..." : "Enviar"}
          </button>

        </div>
      </DialogContent>
    </Dialog>
  );
};