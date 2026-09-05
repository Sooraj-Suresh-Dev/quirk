import { useState, useRef, useEffect } from 'react';

export interface BlueprintGridBgProps {
  mouse: { x: number; y: number };
}

const GRID_SIZE = 60;

export function BlueprintGridBg({ mouse }: BlueprintGridBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localMouse, setLocalMouse] = useState({ x: -999, y: -999, active: false });

  useEffect(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (
      mouse.x >= rect.left &&
      mouse.x <= rect.right &&
      mouse.y >= rect.top &&
      mouse.y <= rect.bottom
    ) {
      setLocalMouse({
        x: Math.round(mouse.x - rect.left),
        y: Math.round(mouse.y - rect.top),
        active: true,
      });
    } else {
      setLocalMouse((prev) => ({ ...prev, active: false }));
    }
  }, [mouse]);

  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const STEP = GRID_SIZE * 1.5;
  const cols = Math.ceil(dimensions.width / STEP) + 2;
  const rows = Math.ceil(dimensions.height / STEP) + 2;

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* 1. SVG Grid Lines Pattern */}
      <svg className="absolute inset-0 w-full h-full" strokeWidth="1">
        <defs>
          <pattern id="blueprint-grid-pattern" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#2D2D2D" strokeOpacity="0.15" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprint-grid-pattern)" />
      </svg>

      {/* 2. Grid Intersection Crosshairs */}
      <div className="absolute inset-0">
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const cx = c * GRID_SIZE * 1.5 + 30;
            const cy = r * GRID_SIZE * 1.5 + 30;
            const dist = localMouse.active ? Math.hypot(localMouse.x - cx, localMouse.y - cy) : 999;
            const isNear = dist < 120;

            return (
              <div
                key={`${r}-${c}`}
                className={`absolute font-mono text-[10px] transition-all duration-200 ${
                  isNear ? 'text-coral scale-125 font-bold' : 'text-charcoal/15'
                }`}
                style={{ left: `${cx}px`, top: `${cy}px`, transform: 'translate(-50%, -50%)' }}
              >
                +
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
