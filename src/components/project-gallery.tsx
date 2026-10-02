"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

export default function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (active !== null && element && !element.open) element.showModal();
    if (active === null && element?.open) element.close();
  }, [active]);

  if (images.length === 0) return null;
  const select = (step: number) =>
    setActive((current) =>
      current === null
        ? null
        : (current + step + images.length) % images.length,
    );

  return (
    <>
      <p className="eyebrow gallery-label">ARCHIVE CAPTURES</p>
      <div className="detail-gallery">
        {images.map((image, index) => (
          <button
            className="gallery-shot"
            key={image}
            onClick={() => setActive(index)}
            aria-label={`Open ${title} screenshot ${index + 1}`}
          >
            <Image
              src={image}
              alt={`${title} screenshot ${index + 1}`}
              fill
              sizes="(max-width: 720px) 100vw, 50vw"
            />
            <span>OPEN IMAGE / 0{index + 1}</span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label={`${title} screenshot viewer`}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === dialog.current) setActive(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") select(1);
          if (event.key === "ArrowLeft") select(-1);
        }}
      >
        {active !== null && (
          <div className="gallery-dialog-content">
            <div className="gallery-dialog-head">
              <span>
                {title.toUpperCase()} / IMAGE{" "}
                {String(active + 1).padStart(2, "0")} OF{" "}
                {String(images.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => setActive(null)}
                aria-label="Close image viewer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="gallery-dialog-image">
              <Image
                src={images[active]}
                alt={`${title} screenshot ${active + 1}`}
                fill
                sizes="90vw"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="gallery-dialog-controls">
                <button
                  onClick={() => select(-1)}
                  aria-label="Previous screenshot"
                >
                  <ArrowLeft size={16} /> PREVIOUS
                </button>
                <button onClick={() => select(1)} aria-label="Next screenshot">
                  NEXT <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
