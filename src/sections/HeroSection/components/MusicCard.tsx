import { useState, useCallback, FormEvent } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { ActionBadge } from "@/components/ActionBadge";
import { SpawnedCassette } from "@/components/SpawnedCassette";
import { type Track } from "@/context/MusicContext";

type ItunesResult = {
  trackName: string;
  artistName: string;
  collectionName: string;
  previewUrl: string;
  artworkUrl100: string;
};

type SpawnedTrack = Track & { x: number; y: number; rotation: number };

const stop = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

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

export const MusicCard = () => {
  const { ref, onStart } = useDraggable();
  const [query, setQuery] = useState("");
  const [spawned, setSpawned] = useState<SpawnedTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (e?: FormEvent) => {
    e?.preventDefault();
    const term = query.trim();
    if (!term) return;
    setLoading(true);
    setError(null);
    setSpawned([]);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=musicTrack&limit=6`
      );
      const data = await res.json();
      const tracks: SpawnedTrack[] = (data.results as ItunesResult[])
        .filter((r) => r.previewUrl)
        .map((r, i) => ({
          previewUrl: r.previewUrl,
          trackName: r.trackName,
          artistName: r.artistName,
          collectionName: r.collectionName,
          artworkUrl: r.artworkUrl100,
          colorIndex: i,
          ...getSpawnPos(i),
        }));
      setSpawned(tracks);
      if (tracks.length === 0) setError("No tracks found.");
    } catch {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <>
      {/* ── Draggable search card ── */}
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
            alt="Icon"
            className="box-border caret-transparent h-full outline-[3px] w-full"
            draggable={false}
          />

          {/* Search input — exact original position */}
          <div
            className="absolute box-border caret-transparent h-10 outline-[3px] w-60 left-10 top-[45px]"
            onMouseDown={stop}
            onTouchStart={stop}
          >
            <form onSubmit={search} className="flex items-center h-full gap-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your vibe..."
                onMouseDown={stop}
                onTouchStart={stop}
                className="text-slate-800 text-2xl bg-transparent h-full leading-8 outline-none rotate-[-1deg] w-full p-0 font-permanent_marker placeholder-slate-400"
                style={{ caretColor: "#1e293b" }}
              />
              <button
                type="submit"
                disabled={loading}
                onMouseDown={stop}
                onTouchStart={stop}
                className="text-[10px] font-bold text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap disabled:opacity-40"
              >
                {loading ? "…" : "GO"}
              </button>
            </form>
            {error && (
              <p className="absolute -bottom-5 left-0 text-rose-500 text-[10px] font-permanent_marker">
                {error}
              </p>
            )}
          </div>

          <ActionBadge
            containerVariant="rotate-[3.0000011085596214deg] right-[30px]"
            labelVariant="text-xs bg-rose-500 leading-4 px-3"
            text="CREATE MIX"
          />
        </div>
      </div>

      {/* ── Spawned cassettes (fixed, independently draggable) ── */}
      {spawned.map((t, i) => (
        <SpawnedCassette
          key={t.previewUrl + i}
          track={t}
          index={i}
          initialX={t.x}
          initialY={t.y}
          rotation={t.rotation}
        />
      ))}
    </>
  );
};
