import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import DesignDashboardUiElements from "../../imports/DesignDashboardUiElements-1-452";
import { useApiClient } from '../../services/api';

export default function DashboardPage() {
    const [liveData, setLiveData] = useState<any[]>([]);
    const [advice, setAdvice] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth0();
    const apiClient = useApiClient();

    // Fetch live data and advice from backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch live data for graph
                const dataResponse = await apiClient.getLiveData();
                setLiveData(dataResponse.data || []);
                
                // Fetch AI advice
                const adviceResponse = await apiClient.getAdvice();
                setAdvice(adviceResponse.advice || 'No advice available');
                
                console.log('✓ Successfully fetched data from backend');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
                setError(errorMessage);
                console.error('✗ Backend connection error:', errorMessage);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Poll for new data every 2 seconds
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, [apiClient]);

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
            <div className="w-full h-screen flex items-center justify-center p-4 md:p-6 lg:p-8">
                <div className="relative w-full max-w-[1440px] mx-auto" style={{ aspectRatio: '1082.4 / 729.6' }}>
                    <div
                        className="absolute inset-0 origin-center flex items-center justify-center"
                        style={{
                            transform: 'scale(min(1, min(calc((100vw - 2rem) / 1082.4), calc((100vh - 2rem) / 729.6))))'
                        }}
                    >
                        <div className="relative" style={{ width: '1082.4px', height: '729.6px' }}>
                            <DesignDashboardUiElements />
                            
                            {/* Status Overlay */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-4 text-white text-xs">
                                <div className="mb-2">
                                    <span className="font-semibold">Status: </span>
                                    {loading ? (
                                        <span className="text-yellow-400">⟳ Connecting to backend...</span>
                                    ) : error ? (
                                        <span className="text-red-400">✗ {error}</span>
                                    ) : (
                                        <span className="text-green-400">✓ Connected</span>
                                    )}
                                </div>
                                {user && <div className="text-gray-300">Monitoring: {user.name}</div>}
                                {advice && <div className="text-gray-300 mt-2">💡 {advice}</div>}
                                <div className="text-gray-400 mt-2">Data Points: {liveData.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
