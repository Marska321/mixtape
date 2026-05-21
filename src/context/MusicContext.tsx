import { createContext, useContext, useState, ReactNode } from "react";

export type Track = {
  previewUrl: string;
  videoId?: string;
  trackName: string;
  artistName: string;
  artworkUrl: string;
  collectionName: string;
  colorIndex: number;
};

type MusicContextType = {
  currentTrack: Track | null;
  setCurrentTrack: (track: Track) => void;
};

const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  setCurrentTrack: () => {},
});

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  return (
    <MusicContext.Provider value={{ currentTrack, setCurrentTrack }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
