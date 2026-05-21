import { useState, useEffect, useCallback } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { useMusic, type Track } from "@/context/MusicContext";

// Real cassette tape colors from the reference
const COLORS = [
  { body: "#e91e8c", shadow: "#b01570", label: "#fff" },  // hot pink
  { body: "#9b59b6", shadow: "#7d3c98", label: "#fff" },  // purple
  { body: "#f5f5f0", shadow: "#d0cec8", label: "#1a1a1a" }, // white
  { body: "#e74c3c", shadow: "#c0392b", label: "#fff" },  // red
  { body: "#3498db", shadow: "#2471a3", label: "#fff" },  // blue
  { body: "#27ae60", shadow: "#1e8449", label: "#fff" },  // green
  { body: "#f39c12", shadow: "#ca6f1e", label: "#1a1a1a" }, // orange
  { body: "#1abc9c", shadow: "#148f77", label: "#fff" },  // teal
];

type Props = {
  track: Track;
  index: number;
  initialX: number;
  initialY: number;
  rotation: number;
};

export const SpawnedCassette = ({ track, index, initialX, initialY, rotation }: Props) => {
  const { currentTrack, setCurrentTrack } = useMusic();
  const [visible, setVisible] = useState(false);
  const [inserted, setInserted] = useState(false);
  const { body, shadow } = COLORS[index % COLORS.length];
  const isActive = currentTrack?.previewUrl === track.previewUrl;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 100);
    return () => clearTimeout(t);
  }, [index]);

  const handleDrop = useCallback((x: number, y: number) => {
    const walkman = document.querySelector("[data-walkman]");
    if (!walkman) return;
    const rect = walkman.getBoundingClientRect();
    // Strict hit zone - must drop exactly on top of the player
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
      setCurrentTrack(track);
      setInserted(true);
    }
  }, [track, setCurrentTrack]);

  const { ref, onStart } = useDraggable(handleDrop);

  // Clamp track name to avoid overflow
  const title = track.trackName.length > 28 ? track.trackName.slice(0, 26) + "…" : track.trackName;
  const artist = track.artistName.length > 22 ? track.artistName.slice(0, 20) + "…" : track.artistName;

  if (inserted) return null;

  return (
    <div
      ref={ref}
      onMouseDown={onStart}
      onTouchStart={onStart}
      className="select-none"
      style={{
        position: "fixed",
        left: initialX,
        top: initialY,
        width: 260,
        touchAction: "none",
        cursor: "grab",
        zIndex: 400 + index,
        opacity: visible ? 1 : 0,
        transform: `rotate(${rotation}deg) scale(${visible ? 1 : 0.5})`,
        transition: `opacity 0.4s ease ${index * 80}ms, transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275) ${index * 80}ms`,
        pointerEvents: "auto",
        filter: isActive ? "drop-shadow(0 0 12px rgba(249,115,22,0.7))" : "drop-shadow(0 8px 16px rgba(0,0,0,0.4))",
      }}
    >
      <svg viewBox="0 0 260 170" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <linearGradient id={`grad-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={body} stopOpacity="1" />
            <stop offset="100%" stopColor={shadow} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Cassette body */}
        <rect x="0" y="0" width="260" height="170" rx="8" fill={`url(#grad-${index})`} />
        {/* Body shading (bottom edge) */}
        <rect x="0" y="148" width="260" height="22" rx="0" fill={shadow} />
        <rect x="0" y="154" width="260" height="16" rx="0" fill={shadow} style={{ opacity: 0.7 }} />
        {/* Corner rounding fix */}
        <rect x="0" y="160" width="260" height="10" rx="8" fill={shadow} style={{ opacity: 0.7 }} />
        {/* Body highlight (top edge) */}
        <rect x="8" y="6" width="244" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />

        {/* ── Label area ── */}
        <rect x="14" y="8" width="232" height="52" rx="4" fill="rgba(255,255,255,0.92)" />
        {/* Side A badge */}
        <rect x="20" y="13" width="22" height="16" rx="2" fill={body} />
        <text x="31" y="24.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="sans-serif">A</text>
        {/* Track name */}
        <text x="50" y="26" fontSize="11" fill="#1a1a1a" fontWeight="bold" fontFamily="'Permanent Marker', cursive"
          style={{ letterSpacing: "0.2px" }}>{title}</text>
        {/* Artist */}
        <text x="50" y="42" fontSize="9" fill="#555" fontFamily="sans-serif">{artist}</text>

        {/* "No." label bottom right of label */}
        <text x="232" y="54" textAnchor="end" fontSize="7" fill="#999" fontFamily="sans-serif">No.{index + 1}</text>

        {/* ── Tape window ── */}
        <rect x="28" y="68" width="204" height="76" rx="6" fill="#111" />
        <rect x="30" y="70" width="200" height="72" rx="5" fill="#1a1a1a" />

        {/* Left reel */}
        <circle cx="82" cy="106" r="30" fill="#222" />
        <circle cx="82" cy="106" r="22" fill="#2d2d2d" />
        <circle cx="82" cy="106" r="8" fill="#444" />
        {/* Left reel hub hole */}
        <circle cx="82" cy="106" r="4" fill="#111" />
        {/* Left spokes */}
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <line key={i}
            x1={82 + 8 * Math.cos(rad)} y1={106 + 8 * Math.sin(rad)}
            x2={82 + 20 * Math.cos(rad)} y2={106 + 20 * Math.sin(rad)}
            stroke="#555" strokeWidth="2" />;
        })}

        {/* Right reel */}
        <circle cx="178" cy="106" r="30" fill="#222" />
        <circle cx="178" cy="106" r="22" fill="#2d2d2d" />
        <circle cx="178" cy="106" r="8" fill="#444" />
        <circle cx="178" cy="106" r="4" fill="#111" />
        {[0, 60, 120, 180, 240, 300].map((a, i) => {
          const rad = (a * Math.PI) / 180;
          return <line key={i}
            x1={178 + 8 * Math.cos(rad)} y1={106 + 8 * Math.sin(rad)}
            x2={178 + 20 * Math.cos(rad)} y2={106 + 20 * Math.sin(rad)}
            stroke="#555" strokeWidth="2" />;
        })}

        {/* Tape strand between reels */}
        <path d="M 82,128 Q 130,136 178,128" stroke="#555" strokeWidth="2.5" fill="none" />

        {/* Guide rollers */}
        <circle cx="38" cy="106" r="7" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
        <circle cx="222" cy="106" r="7" fill="#1c1c1c" stroke="#333" strokeWidth="1" />

        {/* Window shine */}
        <rect x="30" y="70" width="200" height="10" rx="0" fill="rgba(255,255,255,0.04)" />

        {/* ── Bottom strip ── */}
        <text x="130" y="160" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.5)"
          fontFamily="sans-serif" letterSpacing="1">SIDE A • 30 SEC</text>

        {/* Active glow overlay */}
        {isActive && (
          <rect x="0" y="0" width="260" height="170" rx="8" fill="none"
            stroke="#f97316" strokeWidth="3" opacity="0.9" />
        )}
      </svg>

      {/* "drop onto walkman" hint */}
      <div className="absolute -bottom-5 left-0 right-0 text-center pointer-events-none">
        <span className="text-white/40 text-[8px] font-permanent_marker drop-shadow-md">drag → walkman</span>
      </div>
    </div>
  );
};

