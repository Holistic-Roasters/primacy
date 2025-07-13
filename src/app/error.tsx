// app/error.tsx

"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-black)] text-[var(--color-white)]">
      <div className="flex items-center mb-6">
        <span className="text-5xl font-display mr-3 text-[var(--color-coffee)]">
          Error
        </span>
        <span className="text-2xl font-display tracking-wider">
          Something went wrong
        </span>
      </div>
      <p className="mb-8 text-[var(--color-light-grey)] text-lg max-w-xl text-center">
        We&apos;re sorry, but an unexpected error has occurred.
        <br />
        Please try again or return to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg border-2 border-[var(--color-coffee)] text-[var(--color-coffee)] font-display uppercase tracking-wide transition hover:bg-[var(--color-coffee)] hover:text-[var(--color-black)]"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border-2 border-[var(--color-accent)] text-[var(--color-accent)] font-display uppercase tracking-wide transition hover:bg-[var(--color-accent)] hover:text-[var(--color-black)]"
        >
          Home
        </Link>
      </div>
      <p className="mt-8 text-xs text-[var(--color-light-grey)]">
        {error.digest || error.message}
      </p>
    </div>
  );
}
