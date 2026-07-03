

export const PromoPanel = () => (
  <div className="relative hidden lg:flex w-[46%] shrink-0 flex-col items-center justify-center overflow-hidden bg-[#eef0fd] p-10"
    style={{ backgroundImage: "radial-gradient(circle, #c7c5f0 1px, transparent 1px)", backgroundSize: "18px 18px" }}
  >
    <div className="relative z-10 flex w-full max-w-xs flex-col items-center gap-5">

      <div className="text-center">
        <p className="text-[15px] font-extrabold text-slate-800">Diseña sin límites</p>
        <p className="mt-1 text-[12px] leading-relaxed text-slate-400">
          Con Sketra conviertes ideas en diagramas reales usando solo tu voz
        </p>
      </div>

      {[
        {
          bg: "bg-violet-50", border: "border-violet-200", icon: "ti-waveform", iconColor: "text-violet-500",
          title: "Voz a diagrama",
          desc: "Habla y la IA convierte tus palabras en elementos visuales al instante",
        },
        {
          bg: "bg-green-50", border: "border-green-200", icon: "ti-brain", iconColor: "text-green-600",
          title: "IA integrada",
          desc: "Genera planos, flujos y wireframes con Gemini como copiloto",
        },
        {
          bg: "bg-amber-50", border: "border-amber-200", icon: "ti-pencil", iconColor: "text-amber-500",
          title: "Canvas Excalidraw",
          desc: "Editor colaborativo en tiempo real con estilo sketch profesional",
        },
      ].map(({ bg, border, icon, iconColor, title, desc }) => (
        <div key={title}
          className={`flex w-full items-start gap-3 rounded-xl border ${border} bg-white p-3.5`}
          style={{ boxShadow: "0 2px 8px rgba(105,101,219,0.07)" }}
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${border} ${bg}`}>
            <i className={`ti ${icon} ${iconColor}`} style={{ fontSize: 16 }} aria-hidden="true" />
          </div>
          <div>
            <p className="text-[12px] font-extrabold text-slate-800">{title}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">{desc}</p>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap justify-center gap-2">
        {["IA generativa", "Tiempo real", "Voz", "Excalidraw"].map((t) => (
          <span key={t}
            className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600"
          >
            {t}
          </span>
        ))}
      </div>

    </div>
  </div>
);