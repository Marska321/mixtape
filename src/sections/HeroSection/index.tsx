import { BackgroundEffects } from "@/sections/HeroSection/components/BackgroundEffects";
import { ThemeToggle } from "@/sections/HeroSection/components/ThemeToggle";
import { MusicCard } from "@/sections/HeroSection/components/MusicCard";
import { FloatingPreviewCard } from "@/sections/HeroSection/components/FloatingPreviewCard";
import { PlaylistCard } from "@/sections/HeroSection/components/PlaylistCard";
import { YouTubeWalkman } from "@/sections/HeroSection/components/YouTubeWalkman";
import { useTheme } from "@/context/ThemeContext";
import { playlists } from "@/playlists/registry";

const BG = {
  night: "https://retrotape.netlify.app/images/night.webp",
  day:   "https://retrotape.netlify.app/images/day.webp",
};

export const HeroSection = () => {
  const { theme } = useTheme();

  let playlist = null;
  if (typeof window !== "undefined") {
    const mixId = new URLSearchParams(window.location.search).get("mix");
    if (mixId && playlists[mixId]) {
      playlist = playlists[mixId];
    }
  }

  return (
    <div className="relative bg-stone-800 box-border caret-transparent min-h-screen outline-[3px] w-full overflow-hidden">
      {/* Night background */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-700"
        style={{
          backgroundImage: `url('${BG.night}')`,
          opacity: theme === "night" ? 1 : 0,
        }}
      />
      {/* Day background */}
      <div
        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-700"
        style={{
          backgroundImage: `url('${BG.day}')`,
          opacity: theme === "day" ? 1 : 0,
        }}
      />

      <BackgroundEffects />
      <ThemeToggle />
      
      {playlist ? (
        <>
          <PlaylistCard playlist={playlist} />
          <YouTubeWalkman />
        </>
      ) : (
        <>
          <MusicCard />
          <FloatingPreviewCard />
        </>
      )}
    </div>
  );
};
