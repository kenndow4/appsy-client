import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, UserPlus, ShieldCheck } from "lucide-react";
import { useAuth } from "@/provider/auth.provider";

export const RegisterPage = () => {
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register,error, loading } = useAuth();

  const getStrength = (val: string) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthMap = [
    { width: "25%", color: "bg-red-400",    label: "Débil",   labelColor: "text-red-500" },
    { width: "50%", color: "bg-amber-400",  label: "Regular", labelColor: "text-amber-500" },
    { width: "75%", color: "bg-violet-500", label: "Buena",   labelColor: "text-violet-600" },
    { width: "100%",color: "bg-green-500",  label: "Fuerte",  labelColor: "text-green-600" },
  ];

  const strength = password ? strengthMap[getStrength(password) - 1] : null;

 const  handleRegister = async() => {
        if (!name || !lastName || !email || !password) {
            alert("Por favor, completa todos los campos.");
            return;
        }
       await register(name + " " + lastName, email, password);
           
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-100">

        {/* Logo */}
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-xs text-white">✏️</span>
          </div>
          <span className="text-[14px] font-bold text-slate-800">AppsySketra</span>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-400">
            canvas
          </span>
        </div>

        <h1 className="text-[18px] font-bold tracking-tight text-slate-800">
          Crea tu cuenta
        </h1>

        {/* Nombre + Apellido */}
        <div className="mb-3.5 flex gap-2">
          <div className="flex-1">
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Nombre</label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan"
                className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Pérez"
              className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

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
        <div className="relative mb-1.5">
          <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPw ? "text" : "password"}
            placeholder="Mín. 8 caracteres"
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

        {/* Strength bar */}
        {password && strength && (
          <div className="mb-3.5">
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <span className={`mt-1 block text-[11px] font-semibold ${strength.labelColor}`}>
              {strength.label}
            </span>
          </div>
        )}

        {/* Confirm password */}
        <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
          Confirmar contraseña
        </label>
        <div className="relative mb-4">
          <ShieldCheck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            placeholder="Repite tu contraseña"
            className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-300 transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>


        {/* CTA */}
        <button onClick={handleRegister} className="mb-4 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-[13px] font-bold text-white shadow-md shadow-violet-200 transition-all hover:bg-violet-700 hover:shadow-violet-300">
          <UserPlus size={14} />
          {loading ? "Creating account..." : "Crear cuenta"}
        </button>

        {error && (
          <p className="text-center text-[12px] text-red-500">
            {error}
          </p>
        )}

        <p className="mt-5 text-center text-[12px] text-slate-400">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-bold text-violet-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

