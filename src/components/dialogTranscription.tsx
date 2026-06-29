import React, { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Dialog, DialogContent } from "@/component/ui/dialog";
import { Mic, Square } from "lucide-react";

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

  useEffect(() => {
    setMessage(transcript);
  }, [transcript]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSubmit(message);
    setMessage("");
    resetTranscript();
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="max-w-[520px] rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-[15px] font-bold tracking-tight text-slate-800">
            Describe tu aplicación
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400">
            Habla o escribe lo que quieres construir
          </p>
        </div>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ej: créame una app para gestión de tareas con login, tablero kanban y notificaciones..."
          className="w-full min-h-[130px] resize-none rounded-lg border border-slate-200 bg-white p-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSend();
          }}
        />

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between gap-2">

          <div className="flex items-center gap-2">
            {/* Mic */}
            <button
              onClick={listening ? onStopListening : onStartListening}
              aria-label={listening ? "Detener grabación" : "Activar micrófono"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all
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
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-50"
            >
              Limpiar
            </button>
          </div>

          {/* Estado */}
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {listening && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </span>
            )}
            <span className={`text-[11px] ${listening ? "font-semibold text-amber-600" : "text-slate-400"}`}>
              {listening ? "Escuchando..." : "Escribe o habla"}
            </span>
          </div>

          {/* Enviar */}
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="rounded-lg bg-violet-600 px-4 py-2 text-[13px] font-bold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Enviar
          </button>

        </div>
      </DialogContent>
    </Dialog>
  );
};