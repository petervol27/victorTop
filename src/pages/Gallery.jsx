import React, { useEffect, useMemo, useRef, useState } from 'react';
import './gallery.css';

const images = Object.values(
  import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp,gif}', {
    eager: true,
    import: 'default',
  })
).sort();

// simple preloader (avoids layout jank, warms cache)
const preload = (src) =>
  new Promise((res) => {
    const img = new Image();
    img.onload = img.onerror = res;
    img.decoding = 'async';
    img.src = src;
  });

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);
  const threshold = 40;

  const total = images.length;

  // 1) Preload the first screenful of grid images (fast UX)
  useEffect(() => {
    const aboveTheFold = Math.min(16, total); // tune as you like
    images.slice(0, aboveTheFold).forEach(preload);
  }, [total]);

  // 2) When the lightbox opens, preload current/adjacent for snappy nav
  useEffect(() => {
    if (!open) return;
    const curr = images[idx];
    const prevIdx = (idx - 1 + total) % total;
    const nextIdx = (idx + 1) % total;
    preload(curr);
    preload(images[prevIdx]);
    preload(images[nextIdx]);
  }, [open, idx, total]);

  const openAt = (i) => {
    setIdx(i);
    setOpen(true);
    document.documentElement.style.overflow = 'hidden';
  };
  const close = () => {
    setOpen(false);
    document.documentElement.style.overflow = '';
  };
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  // keyboard shortcuts (desktop)
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // touch swipe
  const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
  };

  // Give the browser a hint about how big grid items render
  const sizes = '(max-width: 480px) 33vw, (max-width: 900px) 25vw, 220px';

  const gridItems = useMemo(
    () =>
      images.map((src, i) => {
        const eager = i < 12; // first 12 appear instantly in grid
        return (
          <button
            key={i}
            className="gallery-item"
            onClick={() => openAt(i)}
            aria-label={`open image ${i + 1}`}
          >
            <img
              src={src}
              alt={`gallery ${i + 1}`}
              // make the first row(s) immediate; rest lazy
              loading={eager ? 'eager' : 'lazy'}
              fetchPriority={eager ? 'high' : 'auto'}
              decoding="async"
              draggable="false"
              sizes={sizes}
            />
          </button>
        );
      }),
    [] // images are static
  );

  return (
    <>
      <div className="gallery-grid" dir="rtl">
        {gridItems}
      </div>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="lb-btn lb-prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="previous"
          >
            {/* Icon drawn with CSS; keep text for a11y */}
            <span className="visually-hidden">Prev</span>
          </button>

          <img
            src={images[idx]}
            alt={`full ${idx + 1}`}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
            draggable="false"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <button
            className="lb-btn lb-next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="next"
          >
            <span className="visually-hidden">Next</span>
          </button>

          <div className="lb-counter" onClick={(e) => e.stopPropagation()}>
            {idx + 1} / {total}
          </div>

          <button
            className="lb-close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="close"
            title="Close"
          >
            <span className="visually-hidden">Close</span>
          </button>
        </div>
      )}
    </>
  );
}
