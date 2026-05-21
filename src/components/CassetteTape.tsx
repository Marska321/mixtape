import { useMusic, type Track } from "@/context/MusicContext";

const LABEL_COLORS = [
  { bg: "#e63946", text: "#fff" },
  { bg: "#457b9d", text: "#fff" },
  { bg: "#2a9d8f", text: "#fff" },
  { bg: "#e9c46a", text: "#1a1a2e" },
  { bg: "#f4a261", text: "#1a1a2e" },
  { bg: "#6a4c93", text: "#fff" },
  { bg: "#f72585", text: "#fff" },
  { bg: "#43aa8b", text: "#fff" },
];

type Props = { track: Track; index: number };

export const CassetteTape = ({ track, index }: Props) => {
  const { currentTrack, setCurrentTrack } = useMusic();
  const { bg, text } = LABEL_COLORS[index % LABEL_COLORS.length];
  const isActive = currentTrack?.previewUrl === track.previewUrl;

  return (
    <button
      onClick={() => setCurrentTrack(track)}
      className="relative w-full text-left transition-transform hover:scale-[1.03] active:scale-95 focus:outline-none"
      title={`${track.trackName} — ${track.artistName}`}
    >
      {/* Cassette body */}
      <svg viewBox="0 0 200 115" xmlns="http://www.w3.org/2000/svg" className="w-full">
        {/* Case */}
        <rect x="0" y="0" width="200" height="115" rx="5"
          fill={isActive ? "#2d1b69" : "#1a1a2e"}
          stroke={isActive ? "#a78bfa" : "#2d2d44"} strokeWidth={isActive ? 1.5 : 0.8} />
        {/* Label */}
        <rect x="12" y="6" width="176" height="58" rx="3" fill={bg} />
        {/* Reel left */}
        <circle cx="42" cy="84" r="21" fill="#111" />
        <circle cx="42" cy="84" r="13" fill="#1a1a2e" />
        <circle cx="42" cy="84" r="5" fill="#444" />
        {/* Reel spokes */}
        {[0, 60, 120, 180, 240, 300].map(a => (
          <line key={a}
            x1={42 + 5 * Math.cos((a * Math.PI) / 180)} y1={84 + 5 * Math.sin((a * Math.PI) / 180)}
            x2={42 + 12 * Math.cos((a * Math.PI) / 180)} y2={84 + 12 * Math.sin((a * Math.PI) / 180)}
            stroke="#333" strokeWidth="1.5" />
        ))}
        {/* Reel right */}
        <circle cx="158" cy="84" r="21" fill="#111" />
        <circle cx="158" cy="84" r="13" fill="#1a1a2e" />
        <circle cx="158" cy="84" r="5" fill="#444" />
        {[0, 60, 120, 180, 240, 300].map(a => (
          <line key={a}
            x1={158 + 5 * Math.cos((a * Math.PI) / 180)} y1={84 + 5 * Math.sin((a * Math.PI) / 180)}
            x2={158 + 12 * Math.cos((a * Math.PI) / 180)} y2={84 + 12 * Math.sin((a * Math.PI) / 180)}
            stroke="#333" strokeWidth="1.5" />
        ))}
        {/* Tape window */}
        <rect x="72" y="70" width="56" height="30" rx="3" fill="#0a0a1a" stroke="#333" strokeWidth="0.8" />
        {/* Tape strand */}
        <path d="M 42,84 Q 100,72 158,84" stroke="#555" strokeWidth="1.5" fill="none" />
        {/* Corner notches */}
        <polygon points="0,0 10,0 0,10" fill="#111" />
        <polygon points="200,0 190,0 200,10" fill="#111" />
        {/* Playing indicator */}
        {isActive && <circle cx="188" cy="105" r="4" fill="#a78bfa" />}
      </svg>

      {/* Label text — HTML over SVG for proper truncation */}
      <div
        className="absolute font-permanent_marker leading-tight px-1"
        style={{ top: "5.5%", left: "7%", right: "7%", height: "52%" }}
      >
        <p
          className="text-[11px] font-bold truncate"
          style={{ color: text, textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
        >
          {track.trackName}
        </p>
        <p
          className="text-[9px] mt-0.5 truncate opacity-90"
          style={{ color: text }}
        >
          {track.artistName}
        </p>
        <p
          className="text-[8px] mt-0.5 truncate opacity-60"
          style={{ color: text }}
        >
          {track.collectionName}
        </p>
      </div>
    </button>
  );
};
