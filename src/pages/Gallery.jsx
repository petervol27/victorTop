import React, { useMemo, useRef, useState } from 'react';
import './gallery.css'; // we'll add styles below

const images = Object.values(
  import.meta.glob('../assets/gallery/*.{png,jpg,jpeg,webp,gif}', {
    eager: true,
    import: 'default',
  })
).sort();

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const startX = useRef(null);
  const threshold = 40; // px to count as a swipe

  const total = images.length;
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

  // keyboard for desktop testing
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // touch swipe handlers
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
    startX.current = null;
  };

  const gridItems = useMemo(
    () =>
      images.map((src, i) => (
        <button
          key={i}
          className="gallery-item"
          onClick={() => openAt(i)}
          aria-label={`open image ${i + 1}`}
        >
          <img
            src={src}
            alt={`gallery ${i + 1}`}
            loading="lazy"
            decoding="async"
            draggable="false"
          />
        </button>
      )),
    []
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
            ‹
          </button>
          <img
            src={images[idx]}
            alt={`full ${idx + 1}`}
            className="lightbox-img"
            onClick={(e) => e.stopPropagation()}
            draggable="false"
          />
          <button
            className="lb-btn lb-next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="next"
          >
            ›
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
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
