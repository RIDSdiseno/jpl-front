interface PlaceholderPageProps {
  title: string;
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 p-6">
      <h1 className="text-2xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">
        Módulo en construcción
      </p>
    </div>
  );
}