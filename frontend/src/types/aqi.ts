export interface AQIReading {
  id: string;
  timestamp: string;
  pm25: number;
  aqi_us: number;
  level: string;
  diagnosis?: string;
  created_at: string;
}

export interface AlertSubscription {
  id?: string;
  email?: string;
  phone?: string;
  threshold: number;
  is_active?: boolean;
  created_at?: string;
}

export interface LatestAQI {
  aqi_us: number;
  pm25: number;
  level: string;
  diagnosis: string;
  timestamp: string;
}

export interface HistoricalData {
  timestamp: string;
  pm25: number;
  aqi_us: number;
}

export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: 'bg-green-500', text: 'Tốt', textColor: 'text-white' },
  MODERATE: { min: 51, max: 100, color: 'bg-yellow-500', text: 'Trung bình', textColor: 'text-gray-900' },
  UNHEALTHY_SENSITIVE: { min: 101, max: 150, color: 'bg-orange-500', text: 'Kém', textColor: 'text-white' },
  UNHEALTHY: { min: 151, max: 200, color: 'bg-red-500', text: 'Nguy hại', textColor: 'text-white' },
  VERY_UNHEALTHY: { min: 201, max: 300, color: 'bg-purple-700', text: 'Rất nguy hại', textColor: 'text-white' },
  HAZARDOUS: { min: 301, max: 999, color: 'bg-red-900', text: 'Nguy hiểm', textColor: 'text-white' },
};

export function getAQILevel(aqi: number) {
  if (aqi <= 50) return AQI_LEVELS.GOOD;
  if (aqi <= 100) return AQI_LEVELS.MODERATE;
  if (aqi <= 150) return AQI_LEVELS.UNHEALTHY_SENSITIVE;
  if (aqi <= 200) return AQI_LEVELS.UNHEALTHY;
  if (aqi <= 300) return AQI_LEVELS.VERY_UNHEALTHY;
  return AQI_LEVELS.HAZARDOUS;
}
