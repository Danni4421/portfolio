import { useEffect, useRef, useState } from "react";
import { getImageDominantColor } from "@/shared/lib/image-gradient";

interface ProjectImageProps {
  src: string;
  alt: string;
  loading?: "eager" | "lazy";
}

export function ProjectImage({
  src,
  alt,
  loading = "lazy",
}: ProjectImageProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [dominantColor, setDominantColor] = useState("#111111");

  useEffect(() => {
    let cancelled = false;

    const extractColor = async () => {
      const image = imageRef.current;

      if (!image || !image.complete || !image.naturalWidth) {
        return;
      }

      const color = await getImageDominantColor(image);

      if (!cancelled) {
        setDominantColor(color);
      }
    };

    extractColor();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div className="relative h-full w-full">
      {/* Image container with border */}
      <div className="relative z-10 h-full w-full overflow-hidden rounded-t-[2.5rem] bg-neutral-100">
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          loading={loading}
          onLoad={async (e) =>
            setDominantColor(await getImageDominantColor(e.currentTarget))
          }
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover object-bottom"
        />

        {/* Bottom fade overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-16"
          style={{
            background: `
              linear-gradient(
                to bottom,
                transparent 0%,
                rgba(255, 255, 255, 0.7) 45%,
                #ffffff 100%
              )
            `,
          }}
        />
      </div>

      {/* Top radial gradient shadow */}
      {/*<div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-2/5 rounded-t-[1.5rem]"
        style={{
          transform: "scaleX(1.3)",
          background: `radial-gradient(
            ellipse 80% 100% at 50% 0%,
            ${dominantColor}88 0%,
            ${dominantColor}44 40%,
            transparent 70%
          )`,
        }}
      />*/}

      {/* White bottom gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-10 z-20 h-full rounded-[2.5rem]"
        style={{
          transform: "scaleX(1.5)",
          background: `
            linear-gradient(
              to top,
              #ffffff 0%,
              #ffffff 3%,
              transparent 90%
            )
          `,
        }}
      />
    </div>
  );
}
