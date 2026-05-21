import { useState, useEffect } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { SpawnedCassette } from "@/components/SpawnedCassette";
import { type PlaylistConfig } from "@/playlists/types";
import { type Track } from "@/context/MusicContext";

type SpawnedTrack = Track & { x: number; y: number; rotation: number; id: string };

const getSpawnPos = (index: number) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const baseX = isMobile 
    ? (window.innerWidth / 2) - 130
    : Math.max(420, typeof window !== "undefined" ? window.innerWidth * 0.38 : 420);
  const baseY = isMobile ? 220 : 160;

  const col = index % 3;
  const row = Math.floor(index / 3);
  const x = baseX + col * (isMobile ? 70 : 90) + (Math.random() - 0.5) * 30;
  const y = baseY + row * 55 + (Math.random() - 0.5) * 20;
  const rotation = (Math.random() - 0.5) * 18;
  return { x, y, rotation };
};

export const PlaylistCard = ({ playlist }: { playlist: PlaylistConfig }) => {
  const { ref, onStart } = useDraggable();
  const [spawned, setSpawned] = useState<SpawnedTrack[]>([]);

  useEffect(() => {
    const tracks: SpawnedTrack[] = playlist.tracks.map((pt, i) => ({
      previewUrl: "",
      videoId: pt.videoId,
      trackName: pt.trackName,
      artistName: pt.artistName,
      artworkUrl: "",
      collectionName: playlist.title,
      colorIndex: pt.colorIndex,
      id: pt.videoId + Date.now() + i,
      ...getSpawnPos(i),
    }));
    setSpawned(tracks);
  }, [playlist]);

  return (
    <>
      {/* ── Draggable playlist card ── */}
      <div
        ref={ref}
        onMouseDown={onStart}
        onTouchStart={onStart}
        className="fixed box-border caret-transparent outline-[3px] w-[90vw] max-w-80 z-[200] max-md:left-0 max-md:right-0 max-md:mx-auto max-md:top-4 md:right-10 md:top-10 cursor-grab select-none"
        style={{ touchAction: "none" }}
      >
        <div className="relative aspect-[1.6_/_1] box-border caret-transparent outline-[3px] w-full">
          <img
            src="https://c.animaapp.com/mowjxgtxILU0cG/assets/icon-1.svg"
            alt="Card Background"
            className="box-border caret-transparent h-full outline-[3px] w-full"
            draggable={false}
          />

          <div
            className="absolute box-border caret-transparent h-[120px] outline-[3px] w-[240px] left-10 top-[35px] overflow-y-auto pr-2"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <h2 className="text-slate-800 text-xl font-permanent_marker mb-2 leading-tight truncate">
              {playlist.title}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {playlist.tracks.map((t, i) => (
                <li key={i}>
                  <div className="text-left w-full p-1 rounded">
                    <div className="text-sm font-bold text-slate-800 truncate font-permanent_marker" style={{ letterSpacing: "0.5px" }}>
                      {i + 1}. {t.trackName}
                    </div>
                    <div className="text-[10px] text-slate-600 truncate font-sans">
                      {t.artistName}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {spawned.map((t, i) => (
        <SpawnedCassette
          key={t.id}
          track={t}
          index={t.colorIndex}
          initialX={t.x}
          initialY={t.y}
          rotation={t.rotation}
        />
      ))}
    </>
  );
};
