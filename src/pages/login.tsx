import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
import { useAuth } from "@/provider/auth.provider";

export const LoginPage = () => {
  const [showPw, setShowPw] = useState(false);
  const {error, loading, login} = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(email, password);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100">

        {/* Logo */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-xs text-white">✏️</span>
          </div>
          <span className="text-[14px] font-bold text-slate-800">Appsy Sketra</span>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-400">
            canvas
          </span>
        </div>

        <h1 className="text-[18px] font-bold tracking-tight text-slate-800">
          Bienvenido de vuelta
        </h1>
        <p className="mb-6 mt-1 text-[12px] text-slate-400">
          Inicia sesión para continuar
        </p>

        {/* Email */}
        <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
          Correo electrónico
        </label>
        <div className="relative mb-3.5">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>

        {/* Password */}
        <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
          Contraseña
        </label>
        <div className="relative mb-3.5">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-9 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

    

        {/* CTA */}
        <button onClick={handleLogin} className="mb-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-[13px] font-bold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-violet-300">
          <LogIn size={14} />
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      
        {error && (
          <p className="text-center text-[12px] text-red-500">
            {error}
          </p>
        )}
        <p className="mt-5 text-center text-[12px] text-slate-400">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="font-bold text-violet-600 hover:underline">
            Regístrate gratis
          </a>
        </p>
      </div>
    </div>
  );
};