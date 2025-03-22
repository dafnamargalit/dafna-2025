interface PresaveData {
  songTitle: string;
  artistName: string;
  releaseDate: string;
  spotifyToken?: string | null;
  appleMusicToken?: string | null;
  userId: string;
  streamingService: string;
  quizResult: string;
}

export const presaveApi = {
  async createPresave(data: PresaveData): Promise<boolean> {
    try {
      // Validate input data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid input: data must be an object');
      }

      // Ensure all required fields are present
      if (!data.songTitle || !data.artistName || !data.userId || !data.streamingService) {
        const missingFields = [];
        if (!data.songTitle) missingFields.push('songTitle');
        if (!data.artistName) missingFields.push('artistName');
        if (!data.userId) missingFields.push('userId');
        if (!data.streamingService) missingFields.push('streamingService');
        const error = `Missing required fields: ${missingFields.join(', ')}`;
        console.error(error);
        throw new Error(error);
      }

      // Prepare the payload with explicit type checking
      const payload = {
        songTitle: String(data.songTitle),
        artistName: String(data.artistName),
        releaseDate: String(data.releaseDate || new Date().toISOString().split('T')[0]),
        userId: String(data.userId),
        streamingService: String(data.streamingService),
        quizResult: String(data.quizResult || data.songTitle),
        spotifyToken: data.streamingService === 'spotify' ? String(data.spotifyToken) : null,
        appleMusicToken: data.streamingService === 'apple' ? String(data.appleMusicToken) : null
      };

      console.log('Sending presave request with payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('/api/presaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log('Server response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response:', parseError);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Unknown error from server');
      }

      return true;
    } catch (error) {
      console.error('Presave creation failed:', error);
      throw error;
    }
  }
}; 