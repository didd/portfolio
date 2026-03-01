"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

const HERO_BLUR =
  "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAgCdASoKAAoAAUAmJZQCdAEXZyOp6RzoAP4Lyo1Yky9W8Q9DjHPuPjtaoKjPCckWPp/vF9Rv6gxdYAA=";

export function HeroImage() {
  const [ready, setReady] = useState(false);

  const imgRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete) setReady(true);
  }, []);

  return (
    <div className="animate-fade-up animate-fade-up-1 relative min-h-[60vh] overflow-hidden bg-p-bg2 lg:min-h-0">
      <div
        aria-hidden="true"
        className={`absolute inset-0 bg-cover transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
        style={{
          backgroundImage: `url("${HERO_BLUR}")`,
          backgroundPosition: "center 20%",
        }}
      />

      <Image
        ref={imgRef}
        src="/images/didd-tuni.webp"
        alt="Didd Tuni — Senior Frontend Engineer"
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        placeholder="blur"
        blurDataURL={HERO_BLUR}
        onLoad={() => setReady(true)}
        className={`object-cover object-[center_20%] ${ready ? "opacity-100" : "opacity-0"} transition-opacity duration-200`}
      />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.04)]" />
    </div>
  );
}
