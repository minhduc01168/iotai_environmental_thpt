import { LatestAQI, getAQILevel } from '../types/aqi';

interface CurrentStatusProps {
  data: LatestAQI | null;
  loading: boolean;
}

export function CurrentStatus({ data, loading }: CurrentStatusProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-gray-500 text-center">Không có dữ liệu</p>
      </div>
    );
  }

  const aqiLevel = getAQILevel(data.aqi_us);
  const timestamp = new Date(data.timestamp);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Trạng thái Hiện tại</h2>

      <div className={`${aqiLevel.color} rounded-2xl p-8 mb-6 transition-all duration-300`}>
        <div className="text-center">
          <div className={`text-6xl font-bold ${aqiLevel.textColor} mb-2`}>
            {data.aqi_us}
          </div>
          <div className={`text-2xl font-semibold ${aqiLevel.textColor} mb-4`}>
            AQI - {aqiLevel.text}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600 font-medium">PM2.5</span>
          <span className="text-gray-900 font-bold text-lg">{data.pm25.toFixed(1)} µg/m³</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <span className="text-gray-600 font-medium">Mức độ</span>
          <span className={`font-bold text-lg ${aqiLevel.color.replace('bg-', 'text-')}`}>
            {data.level}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Cập nhật lúc</span>
          <span className="text-gray-900 font-semibold">
            {timestamp.toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
