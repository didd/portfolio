"use client";

import Image from "next/image";
import { useState } from "react";

const HERO_BLUR =
  "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAAAQAgCdASoKAAoAAUAmJZQCdAEXZyOp6RzoAP4Lyo1Yky9W8Q9DjHPuPjtaoKjPCckWPp/vF9Rv6gxdYAA=";

export function HeroImage() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="animate-fade-up animate-fade-up-1 relative aspect-4/5 overflow-hidden bg-p-bg2 sm:aspect-3/4 xl:h-full xl:aspect-auto"
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-300 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div
          className="h-full w-full scale-105 blur-xl"
          style={{
            backgroundImage: `url("${HERO_BLUR}")`,
            backgroundPosition: "center 20%",
            backgroundSize: "cover",
          }}
        />
      </div>

      <Image
        src="/images/didd-tuni.webp"
        alt="Didd Tuni — Senior Frontend Engineer"
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 100vw"
        onLoad={() => {
          setLoaded(true);
        }}
        className="object-cover object-[center_12%] xl:object-[center_20%]"
      />

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.04)]" />
    </div>
  );
}
