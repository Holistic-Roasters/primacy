import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-black)] text-[var(--color-white)]">
      <div className="flex items-center mb-6">
        <span className="text-5xl font-display mr-3 text-[var(--color-accent)]">
          404
        </span>
        <span className="text-2xl font-display tracking-wider">
          Page Not Found
        </span>
      </div>
      <p className="mb-8 text-[var(--color-light-grey)] text-lg">
        Oops! The page you&apos;re looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-display uppercase tracking-wide transition hover:bg-[var(--color-accent)] hover:text-[var(--color-black)]"
      >
        Return Home
      </Link>
    </div>
  );
}
