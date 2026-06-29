import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { useState } from "react";
import { DialogTranscription } from "./components/dialogTranscription";
import { Mic } from "lucide-react";

const houseFloorPlan = {
  elements: [],
  appState: {
    viewBackgroundColor: "#ffffff",
    theme: "light",
  },
};

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <div>Browser no soporta speech recognition</div>;
  }

  const startListening = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "es-ES",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const handleSubmit = (message: string) => {
    console.log(message);

    // aqui llamas backend C#
  };

  return (
    <>
      <div className="flex h-screen flex-col bg-[#f8f9fa]">

        {/* TOPBAR */}
<header className="flex h-12 items-center justify-between border-b border-slate-200 bg-white px-4" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

  <div className="flex items-center gap-3">
    <span className="text-[15px] font-bold text-slate-800 tracking-tight">Appsy</span>

    <div className="h-4 w-px bg-slate-200" />

    <div className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 py-1 pl-1.5 pr-3">
      <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-white text-xs">
        <i className="ti ti-pencil" aria-hidden="true" />
      </div>
      <span className="text-xs font-bold text-violet-600">Sketra</span>
      <span className="text-xs text-slate-400">canvas</span>
    </div>
  </div>

  <button
    onClick={() => setDialogOpen(true)}
    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-violet-50 hover:border-violet-200"
    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
  >
    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600 text-white">
      <Mic size={13} strokeWidth={2.5} />
    </div>
    <span className="text-xs font-semibold text-slate-600">Hablar con IA</span>
  </button>

</header>

        {/* CANVAS */}

        <main className="flex-1">

          <Excalidraw initialData={houseFloorPlan} />

        </main>

        {/* FOOTER */}

        <footer className="flex h-9 items-center justify-between border-t border-gray-200 bg-white px-6">

          <div className="flex gap-4 text-xs text-gray-500">

            <span className="flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-green-500"></div>

              Listo

            </span>

            <span>100%</span>

          </div>

          <span className="text-xs text-gray-500">
            Sketra v1.0
          </span>

        </footer>
      </div>

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
}

export default App;