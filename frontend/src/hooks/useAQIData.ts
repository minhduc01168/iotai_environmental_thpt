import { useState, useEffect } from 'react';
import { LatestAQI, HistoricalData } from '../types/aqi';

export function useAQIData() {
  const [latestData, setLatestData] = useState<LatestAQI | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      // 1. Gọi API lấy dữ liệu mới nhất
      const latestRes = await fetch('/api/latest_aqi');
      if (!latestRes.ok) throw new Error('Failed to fetch latest data');
      const latestJson = await latestRes.json();

      // 2. Gọi API lấy dữ liệu lịch sử
      const historyRes = await fetch('/api/history');
      if (!historyRes.ok) throw new Error('Failed to fetch history data');
      const historyJson = await historyRes.json();

      // Cập nhật State
      setLatestData(latestJson);
      setHistoricalData(historyJson);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      // Chỉ báo lỗi nếu không có dữ liệu cũ để hiển thị
      if (!latestData) {
        setError('Không thể kết nối đến Backend. Hãy đảm bảo Docker đang chạy.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Tự động cập nhật mỗi 30 giây
    const interval = setInterval(() => {
      fetchAllData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    latestData,
    historicalData,
    loading,
    error,
    refetch: fetchAllData
  };
}