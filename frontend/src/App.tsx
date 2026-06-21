import { Activity } from 'lucide-react';
import { CurrentStatus } from './components/CurrentStatus';
import { AIDiagnosis } from './components/AIDiagnosis';
import { HistoricalChart } from './components/HistoricalChart';
import { AlertSystem } from './components/AlertSystem';
import { useAQIData } from './hooks/useAQIData';

function App() {
  const { latestData, historicalData, loading, error } = useAQIData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hệ thống Giám sát Chất lượng Không khí
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Theo dõi và phân tích chỉ số AQI theo thời gian thực
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Lỗi:</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <CurrentStatus data={latestData} loading={loading} />

            <div className="mt-6">
              <AIDiagnosis diagnosis={latestData?.diagnosis || null} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <AlertSystem currentAQI={latestData?.aqi_us || 0} />
          </div>
        </div>

        <div className="mb-6">
          <HistoricalChart data={historicalData} loading={loading} />
        </div>

        <footer className="text-center text-gray-500 text-sm py-6">
          <p>Dữ liệu được cập nhật liên tục</p>
          <p className="mt-1">
            Hệ thống sử dụng AI để chẩn đoán nguồn ô nhiễm dựa trên mô hình Clustering và Classification
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
