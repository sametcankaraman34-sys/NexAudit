import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-[var(--text-secondary)]">
        404
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
        Sayfa bulunamadı
      </h1>
      <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
      </p>
      <Link
        href="/"
        className="btn-transition mt-6 inline-flex min-h-[44px] items-center rounded-xl bg-[var(--primary)] px-5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
      >
        Kontrol paneline dön
      </Link>
    </div>
  );
}
