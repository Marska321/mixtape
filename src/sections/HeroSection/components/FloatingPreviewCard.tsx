import { useState, useRef, useCallback, useEffect } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { useMusic, type Track } from "@/context/MusicContext";

const BTN_W  = (30 / 300) * 100;
const BTN_H  = (50 / 480) * 100;
const BTN_L  = (225 / 300) * 100;
const STOP_T = (230 / 480) * 100;
const PLAY_T = (290 / 480) * 100;
const REW_T  = (350 / 480) * 100;

import { InsertedCassette } from "@/components/InsertedCassette";

export const FloatingPreviewCard = () => {
  const { ref, onStart } = useDraggable();
  const { currentTrack } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [dropGlow, setDropGlow] = useState(false);
  const [inserted, setInserted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const a = audioRef.current;
      if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
    }, 300);
  }, [stopTimer]);

  /* Load new track when cassette is dropped — animate in then load */
  useEffect(() => {
    if (!currentTrack?.previewUrl) return;
    stopTimer();
    // Trigger the slide-in animation
    setInserted(false);
    const insertDelay = setTimeout(() => setInserted(true), 50);

    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;
    audio.pause();
    audio.src = currentTrack.previewUrl;
    audio.volume = volume;
    audio.load();
    setIsPlaying(false);
    setProgress(0);
    // Flash the drop glow
    setDropGlow(true);
    setTimeout(() => setDropGlow(false), 900);

    return () => clearTimeout(insertDelay);
  }, [currentTrack?.previewUrl, stopTimer]); // don't include volume to avoid reloading track when volume changes

  /* Play / Pause */
  const handlePlayPause = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      stopTimer();
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
      startTimer();
      audio.onended = () => { setIsPlaying(false); setProgress(0); stopTimer(); };
    }
  }, [isPlaying, startTimer, stopTimer]);

  /* Stop */
  const handleStop = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setIsPlaying(false); setProgress(0); stopTimer();
  }, [stopTimer]);

  /* Rewind */
  const handleRewind = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const a = audioRef.current;
    if (a) a.currentTime = Math.max(0, a.currentTime - 10);
  }, []);

  const hitArea = (top: number, handler: (e: React.MouseEvent | React.TouchEvent) => void, title: string) => (
    <div
      title={title}
      className="absolute rounded cursor-pointer hover:bg-white/10 active:scale-95 transition-transform"
      style={{ left: `${BTN_L}%`, top: `${top}%`, width: `${BTN_W}%`, height: `${BTN_H}%` }}
      onClick={handler}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    />
  );

  const handleVolumePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    const track = e.currentTarget as HTMLDivElement;
    track.setPointerCapture(e.pointerId);

    const updateVolume = (clientY: number) => {
      const rect = track.getBoundingClientRect();
      let newVol = 1 - (clientY - rect.top) / rect.height;
      newVol = Math.max(0, Math.min(1, newVol));
      setVolume(newVol);
      if (audioRef.current) audioRef.current.volume = newVol;
    };
    
    updateVolume(e.clientY);

    track.onpointermove = (ev) => updateVolume(ev.clientY);
    track.onpointerup = () => {
      track.onpointermove = null;
      track.onpointerup = null;
      track.releasePointerCapture(e.pointerId);
    };
  };

  return (
    <div
      ref={ref}
      data-walkman="true"
      onMouseDown={onStart}
      onTouchStart={onStart}
      className="absolute w-[85vw] max-w-80 z-[1002] max-md:left-0 max-md:right-0 max-md:mx-auto max-md:bottom-8 md:left-[305px] md:top-[142.5px] cursor-grab select-none"
      style={{
        touchAction: "none",
        transform: "rotate(-3.0685619516030718deg)",
        transition: "filter 0.3s ease",
        filter: dropGlow ? "drop-shadow(0 0 20px rgba(249,115,22,0.95))" : "none",
      }}
    >
      <div className="relative w-full" style={{ aspectRatio: "300 / 480" }}>
        <img
          src="/walkman.svg"
          alt="Sony Walkman"
          className="w-full h-full"
          draggable={false}
        />

        {/* ── Cassette window area — positioned over the dark panel ── */}
        <div
          className="absolute overflow-hidden"
          style={{
            left: "8%",
            top: "18%",
            width: "61%",
            height: "54%",
            borderRadius: "4px",
          }}
        >
          {currentTrack ? (
            /* Inserted cassette — slides down from top */
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: inserted ? "translateY(0)" : "translateY(-105%)",
                transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <InsertedCassette track={currentTrack} isPlaying={isPlaying} />

              {/* Play hint overlay */}
              {!isPlaying && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="text-orange-400/80 text-[7px] font-bold animate-pulse bg-black/40 px-1.5 py-0.5 rounded">
                    ▶ PRESS PLAY
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Empty state */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none">
              <svg viewBox="0 0 40 30" className="w-10 opacity-20">
                <rect x="0" y="0" width="40" height="30" rx="3" fill="#888" />
                <circle cx="12" cy="20" r="7" fill="#555" />
                <circle cx="28" cy="20" r="7" fill="#555" />
                <rect x="10" y="5" width="20" height="8" rx="1" fill="#666" />
              </svg>
              <p className="text-white/20 text-[7px] font-permanent_marker leading-tight text-center">
                drop a tape here
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div
          className="absolute"
          style={{ left: "10%", top: "73%", width: "56.7%", height: "0.7%", opacity: isPlaying ? 1 : 0.2 }}
        >
          <div className="w-full h-full bg-white/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Volume Slider */}
        <div
          className="absolute"
          style={{
            left: `${(220 / 300) * 100}%`,
            top: `${(80 / 480) * 100}%`,
            width: `${(36 / 300) * 100}%`,
            height: `${(80 / 480) * 100}%`,
            cursor: "ns-resize",
            touchAction: "none",
          }}
          onPointerDown={handleVolumePointerDown}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Draggable Knob */}
          <div
            className="absolute bg-[#333] border border-[#555] rounded-[1px] pointer-events-none"
            style={{
              left: "33.33%",
              width: "33.33%",
              height: "12.5%",
              top: `${(1 - volume) * 87.5}%`,
            }}
          />
        </div>

        {/* Button hit-areas */}
        {hitArea(STOP_T, handleStop, "Stop")}
        {hitArea(PLAY_T, handlePlayPause, isPlaying ? "Pause" : "Play")}
        {hitArea(REW_T, handleRewind, "Rewind 10s")}
      </div>
    </div>
  );
};
