import { type PlaylistConfig } from "./types";

export const playlists: Record<string, PlaylistConfig> = {
  demo: {
    id: "demo",
    title: "RetroTape Demo Mix",
    tracks: [
      { videoId: "dQw4w9WgXcQ", trackName: "Never Gonna Give You Up", artistName: "Rick Astley", colorIndex: 0 },
      { videoId: "kJQP7kiw5Fk", trackName: "Despacito", artistName: "Luis Fonsi ft. Daddy Yankee", colorIndex: 1 },
      { videoId: "JGwWNGJdvx8", trackName: "Shape of You", artistName: "Ed Sheeran", colorIndex: 2 },
    ],
  },
};
