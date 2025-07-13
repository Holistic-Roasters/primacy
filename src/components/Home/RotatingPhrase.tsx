"use client";

import { useEffect, useState } from "react";

interface RotatingPhraseProps {
  phrases: { color: string; text: string }[];
}

export default function RotatingPhrase({ phrases }: RotatingPhraseProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => setIndex((i) => (i + 1) % phrases.length),
      3500
    );
    return () => clearTimeout(timeout);
  }, [index, phrases.length]);

  return (
    <span
      key={index}
      className="transition-opacity duration-700 font-display text-lg md:text-2xl"
      style={{
        color: phrases[index].color,
        opacity: 1,
        willChange: "opacity",
      }}
    >
      {phrases[index].text}
    </span>
  );
}
