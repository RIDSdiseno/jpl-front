import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  Bluetooth,
  KeyRound,
  Lock,
  LogIn,
  MapPin,
  Radio,
  Satellite,
  ShieldCheck,
  User,
} from 'lucide-react';
import { loginRequest } from '../services/auth.service';
import { useAuthStore } from '../store/auth.store';

const carouselItems = [
  { title: 'Candado inteligente', icon: Lock },
  { title: 'Bluetooth', icon: Bluetooth },
  { title: 'Rastreo GPS', icon: MapPin },
  { title: 'IoT / LoRa', icon: Radio },
  { title: 'Satélite', icon: Satellite },
  { title: 'NFC / Contraseñas', icon: KeyRound },
];

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as
  | string
  | undefined;

export function LoginPage() {
  const setSession = useAuthStore((state) => state.setSession);

  const [activeSlide, setActiveSlide] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('es');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % carouselItems.length);
    }, 2500);

    return () => window.clearInterval(interval);
  }, []);

  const activeItem = carouselItems[activeSlide];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Ingrese usuario y contraseña.');
      return;
    }

    if (!recaptchaToken) {
      setError('Confirme que no es un robot.');
      return;
    }

    try {
      setLoading(true);

      const response = await loginRequest({
        username,
        password,
        recaptchaToken,
      });

      setSession(response.data.user, response.data.accessToken);
      window.location.href = '/dashboard';
    } catch {
      setError('Credenciales inválidas o captcha inválido.');
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#020817] text-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(79,70,229,0.22),transparent_34%),radial-gradient(circle_at_25%_50%,rgba(6,182,212,0.16),transparent_32%)]" />

      <header className="relative z-10 flex h-14 items-center justify-between border-b border-cyan-500/20 bg-slate-950/70 px-8 backdrop-blur">
        <div className="flex items-center gap-3 font-mono text-sm tracking-[0.35em] text-cyan-300">
          <span className="text-cyan-500">•••</span>
          JPL AIoT Lock
        </div>

        <div className="hidden font-mono text-xs tracking-[0.6em] text-slate-400 md:block">
          SISTEMA DE PLATAFORMA IOT
        </div>

        <div className="flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-slate-400">
          Acceso Inteligente
          <span className="text-emerald-400">• EN LÍNEA</span>
        </div>
      </header>

      <section className="relative z-10 grid min-h-[calc(100vh-56px)] grid-cols-1 items-center gap-10 px-8 lg:grid-cols-2 lg:px-32">
        <div className="hidden justify-center lg:flex">
          <div className="w-[440px] text-center">
            <div className="mb-5 flex items-center justify-center gap-4 font-mono text-xs tracking-[0.55em] text-cyan-400">
              <span className="h-px w-20 bg-cyan-500/40" />
              PLATAFORMA DE CONTROL AIOT
              <span className="h-px w-20 bg-cyan-500/40" />
            </div>

            <h1 className="font-mono text-4xl font-black tracking-[0.18em] text-cyan-200">
              JPL AIoT Lock
            </h1>

            <p className="mt-3 font-mono text-xs tracking-[0.45em] text-slate-400">
              SISTEMA DE ACCESO INTELIGENTE
            </p>

            <div className="relative mx-auto mt-8 flex h-40 w-80 items-center justify-center overflow-hidden">
              {carouselItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === activeSlide;
                const isBefore = index < activeSlide;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`absolute flex h-32 w-32 items-center justify-center rounded-2xl border transition-all duration-700 ${
                      isActive
                        ? 'z-20 border-cyan-400/60 bg-cyan-400/10 opacity-100 shadow-[0_0_45px_rgba(34,211,238,0.25)]'
                        : 'z-10 border-slate-700/40 bg-slate-900/20 opacity-20'
                    }`}
                    style={{
                      transform: isActive
                        ? 'translateX(0) scale(1)'
                        : isBefore
                          ? 'translateX(-150px) scale(0.75)'
                          : 'translateX(150px) scale(0.75)',
                    }}
                  >
                    <Icon
                      size={58}
                      className={isActive ? 'text-cyan-300' : 'text-slate-600'}
                    />
                  </button>
                );
              })}
            </div>

            <p className="mt-2 font-mono text-sm font-bold text-cyan-300">
              {activeItem.title}
            </p>

            <div className="mt-6 flex justify-center gap-2">
              {carouselItems.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeSlide
                      ? 'w-8 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                      : 'w-1.5 bg-cyan-700/50'
                  }`}
                  aria-label={item.title}
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-2">
              {['NFC', 'BLE', 'LoRa', 'GPS', 'MQTT', '4G'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 font-mono text-xs text-cyan-300"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mx-auto mt-8 max-w-sm text-sm leading-7 text-slate-400">
              Control de acceso inteligente con tecnología IoT, monitoreo en
              tiempo real, geocercas y gestión de dispositivos.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 text-left">
              {[
                ['Candados IoT', 'Gestión de dispositivos'],
                ['Control remoto', 'Comandos en tiempo real'],
                ['Eventos', 'Monitoreo en tiempo real'],
                ['Auditoría', 'Seguridad y trazabilidad'],
                ['Tracking GPS', 'Rastreo y geocercas'],
                ['NFC / Contraseñas', 'Accesos dinámicos'],
              ].map(([title, desc]) => (
                <div
                  key={title}
                  className="rounded-lg border border-cyan-400/20 bg-slate-900/70 p-4"
                >
                  <p className="font-mono text-xs font-bold text-cyan-300">
                    {title}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-cyan-400/50 bg-slate-950/75 p-8 shadow-[0_0_70px_rgba(34,211,238,0.18)] backdrop-blur"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/40 bg-cyan-400/10">
              <ShieldCheck size={38} className="text-cyan-300" />
            </div>

            <h2 className="mt-5 text-center font-mono text-2xl font-black tracking-[0.15em] text-cyan-200">
              HHDlink
            </h2>

            <p className="mt-2 text-center font-mono text-xs tracking-[0.35em] text-slate-500">
              JPL AIOT LOCK PLATFORM
            </p>

            <div className="mt-8 space-y-5">
              <label className="block">
                <span className="font-mono text-xs tracking-[0.3em] text-slate-400">
                  USUARIO
                </span>

                <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-3">
                  <User size={18} className="text-cyan-400" />

                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-600"
                    placeholder="Ingrese su nombre de usuario"
                  />
                </div>
              </label>

              <label className="block">
                <span className="font-mono text-xs tracking-[0.3em] text-slate-400">
                  CONTRASEÑA
                </span>

                <div className="mt-2 flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-3">
                  <Lock size={18} className="text-cyan-400" />

                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-600"
                    placeholder="Ingrese su contraseña"
                  />
                </div>
              </label>

              <div className="flex justify-center rounded-lg border border-slate-700 bg-slate-900/80 p-3">
                {recaptchaSiteKey ? (
                  <ReCAPTCHA
                    sitekey={recaptchaSiteKey}
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                  />
                ) : (
                  <p className="text-center text-sm text-red-300">
                    Falta configurar VITE_RECAPTCHA_SITE_KEY
                  </p>
                )}
              </div>

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-12 w-full rounded-lg border border-slate-700 bg-slate-900/80 px-4 text-sm uppercase tracking-[0.2em] text-slate-400 outline-none"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>

              {error ? (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              <button
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 font-mono text-sm font-black tracking-[0.25em] text-white shadow-lg shadow-cyan-500/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={18} />
                {loading ? 'INGRESANDO...' : 'INGRESAR'}
              </button>

              <p className="text-center text-xs text-slate-500">
                Acceso seguro mediante token Bearer
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}