interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    release_date: string;
  };
}

interface AppleMusicTrack {
  id: string;
  attributes: {
    name: string;
    artistName: string;
    albumName: string;
    releaseDate: string;
  };
}

export const spotifyApi = {
  async preSaveTrack(trackId: string, accessToken: string) {
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error pre-saving to Spotify:', error);
      return false;
    }
  },

  async searchTrack(query: string, accessToken: string): Promise<SpotifyTrack | null> {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.tracks.items[0] || null;
    } catch (error) {
      console.error('Error searching Spotify:', error);
      return null;
    }
  }
};

export const appleMusicApi = {
  async preSaveTrack(trackId: string, accessToken: string) {
    try {
      const response = await fetch(
        `https://api.music.apple.com/v1/me/library?ids=${trackId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Music-User-Token': accessToken,
          },
        }
      );
      return response.ok;
    } catch (error) {
      console.error('Error pre-saving to Apple Music:', error);
      return false;
    }
  },

  async searchTrack(query: string, accessToken: string): Promise<AppleMusicTrack | null> {
    try {
      const response = await fetch(
        `https://api.music.apple.com/v1/catalog/us/search?term=${encodeURIComponent(query)}&types=songs&limit=1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.results.songs.data[0] || null;
    } catch (error) {
      console.error('Error searching Apple Music:', error);
      return null;
    }
  }
}; 