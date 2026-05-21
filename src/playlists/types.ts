export type PlaylistConfig = {
  id: string;
  title: string;
  tracks: PlaylistTrack[];
};

export type PlaylistTrack = {
  videoId: string;
  trackName: string;
  artistName: string;
  colorIndex: number;
};
