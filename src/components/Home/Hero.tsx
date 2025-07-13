import RotatingPhrase from "@/components/Home/RotatingPhrase";
import Link from "next/link";

const phrases = [
  { color: "#00ff9d", text: "Stock Hacking Your Morning." },
  { color: "#00c6ff", text: "You Can’t Win The Day If You Lose The Night." },
];

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] bg-[var(--color-black)] flex flex-col justify-center items-center pt-24 pb-14 px-4 text-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="font-display text-5xl md:text-6xl text-white mb-4 leading-tight uppercase tracking-widest">
          Upgrade Your{" "}
          <span className="text-[var(--color-accent)]">24-Hour OS.</span>
        </h1>
        <div className="mb-6">
          <span className="block font-display text-lg md:text-2xl text-white tracking-wide mb-1">
            <span className="text-[var(--color-accent)]">APEX</span> powers the
            ascent. <span className="text-[#00c6ff]">RESET</span> commands the
            descent.
          </span>
          <span className="block text-[var(--color-light-grey)] text-base md:text-lg font-medium max-w-lg mx-auto">
            Together they create a self-reinforcing performance loop.
          </span>
        </div>

        {/* Rotating subhead */}
        <div className="h-9 md:h-10 flex items-center justify-center mb-8">
          <RotatingPhrase phrases={phrases} />
        </div>
        {/* SEO: all phrases included for crawlers */}
        <div className="sr-only">{phrases.map((p) => p.text).join(" ")}</div>

        {/* CTA buttons */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-center mb-10">
          <a
            href="#pricing"
            className="inline-block bg-[var(--color-accent)] text-[var(--color-black)] px-8 py-3 rounded-lg uppercase font-display font-semibold tracking-wider text-lg border-2 border-[var(--color-accent)] transition hover:bg-transparent hover:text-[var(--color-accent)]"
          >
            Initiate the Complete Protocol
          </a>
          <Link
            href="#problem-opportunity"
            className="inline-block mt-2 md:mt-0 text-[var(--color-light-grey)] font-semibold underline decoration-dotted underline-offset-4 text-base hover:text-[var(--color-accent)] transition"
          >
            Scroll to see how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
