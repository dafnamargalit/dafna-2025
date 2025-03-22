'use client';

import { useEffect, useState } from 'react';
import { Presave } from '@prisma/client';

interface PresaveWithTokens extends Presave {
  userTokens: {
    spotifyToken: string | null;
    appleMusicToken: string | null;
  } | null;
}

export default function AdminDashboard() {
  const [presaves, setPresaves] = useState<PresaveWithTokens[]>([]);
  const [selectedSong, setSelectedSong] = useState('');
  const [dspId, setDspId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPresaves();
  }, []);

  const fetchPresaves = async () => {
    try {
      const response = await fetch('/api/presaves');
      const data = await response.json();
      setPresaves(data.presaves);
    } catch (error) {
      console.error('Error fetching presaves:', error);
    }
  };

  const handleCompletePresaves = async () => {
    if (!selectedSong || !dspId) {
      alert('Please fill in both song title and DSP ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/presaves/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: selectedSong,
          dspId: dspId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete presaves');
      }

      alert('Presaves completed successfully!');
      fetchPresaves(); // Refresh the list
    } catch (error) {
      console.error('Error completing presaves:', error);
      alert('Failed to complete presaves');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Presave Dashboard</h1>
        
        {/* Complete Presaves Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Complete Presaves</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Song Title</label>
              <input
                type="text"
                value={selectedSong}
                onChange={(e) => setSelectedSong(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter song title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">DSP ID</label>
              <input
                type="text"
                value={dspId}
                onChange={(e) => setDspId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter DSP ID"
              />
            </div>
            <button
              onClick={handleCompletePresaves}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Complete Presaves'}
            </button>
          </div>
        </div>

        {/* Presaves List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">All Presaves</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Song</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {presaves.map((presave) => (
                  <tr key={presave.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{presave.songTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{presave.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{presave.streamingService}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${presave.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                          presave.status === 'FAILED' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {presave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(presave.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 