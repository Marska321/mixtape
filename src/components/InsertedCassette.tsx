import { type Track } from "@/context/MusicContext";

// Must match SpawnedCassette COLORS array exactly
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

/** Mini cassette SVG rendered inside the walkman window, rotated 90° */
export const InsertedCassette = ({ track, isPlaying }: { track: Track, isPlaying: boolean }) => {
  const { body, shadow } = COLORS[track.colorIndex % COLORS.length];
  const title = track.trackName.length > 18 ? track.trackName.slice(0, 16) + "…" : track.trackName;
  const artist = track.artistName.length > 14 ? track.artistName.slice(0, 12) + "…" : track.artistName;

  return (
    // Container fills the walkman window, rotate 90° so cassette is portrait-style
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ transform: "rotate(90deg)" }}
    >
      <svg
        viewBox="0 0 260 170"
        xmlns="http://www.w3.org/2000/svg"
        // Scale to fill the rotated window (height becomes the limiting axis)
        style={{ width: "165%", height: "auto", maxHeight: "180%" }}
      >
        <defs>
          <linearGradient id={`grad-inserted`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={body} stopOpacity="1" />
            <stop offset="100%" stopColor={shadow} stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Body */}
        <rect x="0" y="0" width="260" height="170" rx="8" fill="url(#grad-inserted)" />
        {/* Bottom shading */}
        <rect x="0" y="148" width="260" height="22" rx="0" fill={shadow} />
        <rect x="0" y="160" width="260" height="10" rx="8" fill={shadow} style={{ opacity: 0.7 }} />
        {/* Top highlight */}
        <rect x="8" y="6" width="244" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />

        {/* Label area */}
        <rect x="14" y="8" width="232" height="52" rx="4" fill="rgba(255,255,255,0.92)" />
        {/* Side A badge */}
        <rect x="20" y="13" width="22" height="16" rx="2" fill={body} />
        <text x="31" y="24.5" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold" fontFamily="sans-serif">A</text>
        {/* Track name — rotated back so text reads correctly */}
        <text x="50" y="26" fontSize="10" fill="#1a1a1a" fontWeight="bold" fontFamily="'Permanent Marker', cursive"
          style={{ letterSpacing: "0.2px" }}>{title}</text>
        <text x="50" y="42" fontSize="8" fill="#555" fontFamily="sans-serif">{artist}</text>
        <text x="232" y="54" textAnchor="end" fontSize="7" fill="#999" fontFamily="sans-serif">NR</text>

        {/* Tape window */}
        <rect x="28" y="68" width="204" height="76" rx="6" fill="#111" />
        <rect x="30" y="70" width="200" height="72" rx="5" fill="#1a1a1a" />

        {/* Left reel */}
        <g 
          style={{ transformOrigin: "82px 106px" }} 
          className={isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}
        >
          <circle cx="82" cy="106" r="30" fill="#222" />
          <circle cx="82" cy="106" r="22" fill="#2d2d2d" />
          <circle cx="82" cy="106" r="8" fill="#444" />
          <circle cx="82" cy="106" r="4" fill="#111" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i}
              x1={82 + 8 * Math.cos(rad)} y1={106 + 8 * Math.sin(rad)}
              x2={82 + 20 * Math.cos(rad)} y2={106 + 20 * Math.sin(rad)}
              stroke="#555" strokeWidth="2" />;
          })}
        </g>

        {/* Right reel */}
        <g 
          style={{ transformOrigin: "178px 106px" }}
          className={isPlaying ? "animate-[spin_3s_linear_infinite]" : ""}
        >
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
        </g>

        {/* Tape strand */}
        <path d="M 82,128 Q 130,136 178,128" stroke="#555" strokeWidth="2.5" fill="none" />

        {/* Guide rollers */}
        <circle cx="38" cy="106" r="7" fill="#1c1c1c" stroke="#333" strokeWidth="1" />
        <circle cx="222" cy="106" r="7" fill="#1c1c1c" stroke="#333" strokeWidth="1" />

        {/* Window shine */}
        <rect x="30" y="70" width="200" height="10" rx="0" fill="rgba(255,255,255,0.04)" />

        {/* Bottom strip */}
        <text x="130" y="160" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.5)"
          fontFamily="sans-serif" letterSpacing="1">SIDE A • 30 SEC</text>
      </svg>
    </div>
  );
};
