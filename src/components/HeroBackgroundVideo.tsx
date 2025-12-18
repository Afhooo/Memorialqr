"use client";

import { useEffect, useRef, useState } from "react";

interface HeroBackgroundVideoProps {
  sources: string[];
  roundedClass?: string;
}

export function HeroBackgroundVideo({ sources, roundedClass = "rounded-[38px]" }: HeroBackgroundVideoProps) {
  const primaryRef = useRef<HTMLVideoElement>(null);
  const secondaryRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState<0 | 1>(0);
  const activeRef = useRef<0 | 1>(0);
  const sourceIndexRef = useRef(0);

  useEffect(() => {
    if (!sources.length) {
      return;
    }

    const primary = primaryRef.current;
    const secondary = secondaryRef.current;
    if (!primary || !secondary) {
      return;
    }

    sourceIndexRef.current = 0;
    primary.src = sources[0];
    primary.load();
    primary.play().catch(() => {});

    const preloadNext = sources[(sourceIndexRef.current + 1) % sources.length];
    secondary.src = preloadNext;
    secondary.load();

    const handleEnded = () => {
      const outgoing = activeRef.current;
      const incoming = outgoing === 0 ? 1 : 0;
      const incomingEl = incoming === 0 ? primaryRef.current : secondaryRef.current;
      if (!incomingEl) {
        return;
      }

      const nextIndex = (sourceIndexRef.current + 1) % sources.length;
      incomingEl.src = sources[nextIndex];
      incomingEl.currentTime = 0;
      incomingEl.load();
      incomingEl.play().catch(() => {});

      sourceIndexRef.current = nextIndex;
      activeRef.current = incoming;
      setActive(incoming);
    };

    primary.addEventListener("ended", handleEnded);
    secondary.addEventListener("ended", handleEnded);

    return () => {
      primary.removeEventListener("ended", handleEnded);
      secondary.removeEventListener("ended", handleEnded);
    };
  }, [sources]);

  return (
    <div className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${roundedClass}`}>
      <video
        ref={primaryRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
          active === 0 ? "opacity-100" : "opacity-0"
        }`}
        muted
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={secondaryRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
          active === 1 ? "opacity-100" : "opacity-0"
        }`}
        muted
        autoPlay
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55" />
    </div>
  );
}
