import { useState, useRef, useCallback, useEffect } from "react";
import { useDraggable } from "@/hooks/useDraggable";
import { useMusic } from "@/context/MusicContext";
import { InsertedCassette } from "@/components/InsertedCassette";

// Declare YT for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const BTN_W  = (30 / 300) * 100;
const BTN_H  = (50 / 480) * 100;
const BTN_L  = (225 / 300) * 100;
const STOP_T = (230 / 480) * 100;
const PLAY_T = (290 / 480) * 100;
const REW_T  = (350 / 480) * 100;

export const YouTubeWalkman = () => {
  const { ref, onStart } = useDraggable();
  const { currentTrack } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [dropGlow, setDropGlow] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [isMobileTapRequired, setIsMobileTapRequired] = useState(false);

  const playerRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isApiReady = useRef(false);

  // Load YouTube Iframe API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        isApiReady.current = true;
      };
    } else if (window.YT && window.YT.Player) {
      isApiReady.current = true;
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getCurrentTime === "function" && typeof player.getDuration === "function") {
        const cTime = player.getCurrentTime();
        const dur = player.getDuration();
        if (dur > 0) setProgress((cTime / dur) * 100);
      }
    }, 300);
  }, [stopTimer]);

  /* Load new track when cassette is dropped */
  useEffect(() => {
    if (!currentTrack?.videoId) return;
    stopTimer();
    setIsPlaying(false);
    setProgress(0);
    setInserted(false);

    // On mobile we might need explicit tap
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) setIsMobileTapRequired(true);

    const insertDelay = setTimeout(() => setInserted(true), 50);

    // If player exists, load video. Else create player.
    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(currentTrack.videoId);
      playerRef.current.pauseVideo();
      playerRef.current.setVolume(volume * 100);
    } else if (isApiReady.current && window.YT) {
      playerRef.current = new window.YT.Player("yt-hidden-player", {
        height: "0",
        width: "0",
        videoId: currentTrack.videoId,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1 },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(volume * 100);
          },
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startTimer();
            } else if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setProgress(0);
              stopTimer();
            } else if (e.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopTimer();
            }
          },
        },
      });
    }

    setDropGlow(true);
    setTimeout(() => setDropGlow(false), 900);

    return () => clearTimeout(insertDelay);
  }, [currentTrack?.videoId, stopTimer]); // excluded volume to avoid reload

  /* Play / Pause */
  const handlePlayPause = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    e?.stopPropagation();
    setIsMobileTapRequired(false);
    const player = playerRef.current;
    if (!player || !player.getPlayerState) return;

    const state = player.getPlayerState();
    // 1 is PLAYING
    if (state === 1) {
      player.pauseVideo();
      setIsPlaying(false);
      stopTimer();
    } else {
      player.playVideo();
    }
  }, [stopTimer]);

  /* Stop */
  const handleStop = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const player = playerRef.current;
    if (player && typeof player.stopVideo === "function") {
      player.stopVideo();
      player.seekTo(0);
    }
    setIsPlaying(false);
    setProgress(0);
    stopTimer();
  }, [stopTimer]);

  /* Rewind */
  const handleRewind = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const player = playerRef.current;
    if (player && typeof player.getCurrentTime === "function") {
      player.seekTo(Math.max(0, player.getCurrentTime() - 10));
    }
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
      if (playerRef.current && typeof playerRef.current.setVolume === "function") {
        playerRef.current.setVolume(newVol * 100);
      }
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
      className="absolute w-80 z-[1002] left-[305.15px] top-[142.5px] cursor-grab select-none"
      style={{
        touchAction: "none",
        transform: "rotate(-3.0685619516030718deg)",
        transition: "filter 0.3s ease",
        filter: dropGlow ? "drop-shadow(0 0 20px rgba(249,115,22,0.95))" : "none",
      }}
    >
      <div id="yt-hidden-player" className="hidden" />

      <div className="relative w-full" style={{ aspectRatio: "300 / 480" }}>
        <img
          src="/walkman.svg"
          alt="Sony Walkman"
          className="w-full h-full"
          draggable={false}
        />

        {/* Cassette window area */}
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
            <div
              style={{
                position: "absolute",
                inset: 0,
                transform: inserted ? "translateY(0)" : "translateY(-105%)",
                transition: "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              <InsertedCassette track={currentTrack} isPlaying={isPlaying} />

              {!isPlaying && !isMobileTapRequired && (
                <div className="absolute bottom-1 left-0 right-0 flex justify-center pointer-events-none">
                  <span className="text-orange-400/80 text-[7px] font-bold animate-pulse bg-black/40 px-1.5 py-0.5 rounded">
                    ▶ PRESS PLAY
                  </span>
                </div>
              )}
            </div>
          ) : (
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

        {/* Mobile Tap Overlay */}
        {isMobileTapRequired && currentTrack && inserted && (
          <div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 rounded cursor-pointer backdrop-blur-[1px]"
            onClick={handlePlayPause}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="bg-orange-500 text-white font-bold font-permanent_marker px-4 py-2 rounded-full shadow-lg animate-pulse text-sm flex items-center gap-2">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              TAP TO START
            </div>
          </div>
        )}

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
