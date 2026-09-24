import { useRef, useEffect } from 'react';

export interface BlueprintGridBgProps {
  mouse: { x: number; y: number };
}

const GRID_SIZE = 60;
const STEP = GRID_SIZE * 1.5; // 90 — matches original crosshair spacing
const PROXIMITY = 120;
const OFFSET = 30; // + center: c * STEP + 30

const gridLines = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${GRID_SIZE}' height='${GRID_SIZE}'%3E%3Cpath d='M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}' fill='none' stroke='%232D2D2D' stroke-opacity='0.15' stroke-width='1'/%3E%3C/svg%3E`;

// Idle + marks — charcoal/15, 10px, same grid as original crosshairs
const crosshairIdle = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${STEP}' height='${STEP}'%3E%3Ctext x='${OFFSET}' y='${OFFSET}' text-anchor='middle' dominant-baseline='central' font-family='ui-monospace,monospace' font-size='10' fill='rgba(29,29,29,0.15)'%3E+%3C/text%3E%3C/svg%3E`;

// Near cursor — coral, bold, ~1.25× (scale-125 equivalent)
const crosshairActive = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${STEP}' height='${STEP}'%3E%3Ctext x='${OFFSET}' y='${OFFSET}' text-anchor='middle' dominant-baseline='central' font-family='ui-monospace,monospace' font-size='12.5' font-weight='700' fill='%23E8725C'%3E+%3C/text%3E%3C/svg%3E`;

export function BlueprintGridBg({ mouse }: BlueprintGridBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const hasPointer = mouse.x > -990 || mouse.y > -990;

  useEffect(() => {
    if (!hasPointer) return;
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const inside =
      mouse.x >= rect.left &&
      mouse.x <= rect.right &&
      mouse.y >= rect.top &&
      mouse.y <= rect.bottom;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (inside) {
        el.style.setProperty('--mx', `${Math.round(mouse.x - rect.left)}px`);
        el.style.setProperty('--my', `${Math.round(mouse.y - rect.top)}px`);
        el.style.setProperty('--crosshair-visible', '1');
      } else {
        el.style.setProperty('--crosshair-visible', '0');
      }
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, [mouse, hasPointer]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none blueprint-grid"
      aria-hidden="true"
      style={{
        '--mx': '-999px',
        '--my': '-999px',
        '--crosshair-visible': '0',
        '--proximity': `${PROXIMITY}px`,
        backgroundImage: `url("${gridLines}")`,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
      } as React.CSSProperties}
    >
      {/* Idle crosshairs — always visible, same as before */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${crosshairIdle}")`,
          backgroundSize: `${STEP}px ${STEP}px`,
          backgroundPosition: `${OFFSET}px ${OFFSET}px`,
        }}
      />
      {/* Active crosshairs — only after first pointer move (skips mask cost on mobile first paint) */}
      {hasPointer && (
        <div
          className="absolute inset-0 transition-opacity duration-200"
          style={{
            backgroundImage: `url("${crosshairActive}")`,
            backgroundSize: `${STEP}px ${STEP}px`,
            backgroundPosition: `${OFFSET}px ${OFFSET}px`,
            opacity: 'var(--crosshair-visible)',
            WebkitMaskImage:
              'radial-gradient(circle var(--proximity) at var(--mx) var(--my), #000 0%, #000 55%, transparent 100%)',
            maskImage:
              'radial-gradient(circle var(--proximity) at var(--mx) var(--my), #000 0%, #000 55%, transparent 100%)',
          }}
        />
      )}
    </div>
  );
}
