import { useState, useEffect } from 'react';
import { Bell, Settings, Volume2, VolumeX } from 'lucide-react';

interface AlertSystemProps {
  currentAQI: number;
}

export function AlertSystem({ currentAQI }: AlertSystemProps) {
  // Mặc định cảnh báo ở mức 150
  const [threshold, setThreshold] = useState(150);
  const [enableDesktop, setEnableDesktop] = useState(false);
  const [enableSound, setEnableSound] = useState(false);
  const [isAlertActive, setIsAlertActive] = useState(false);

  // Xin quyền thông báo trình duyệt
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Trình duyệt này không hỗ trợ thông báo hệ thống');
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setEnableDesktop(true);
    }
  };

  // Logic kiểm tra và kích hoạt cảnh báo
  useEffect(() => {
    if (currentAQI >= threshold) {
      if (!isAlertActive) {
        setIsAlertActive(true);
        triggerAlert();
      }
    } else {
      setIsAlertActive(false);
    }
  }, [currentAQI, threshold]);

  // Thêm hàm tạo âm thanh beep
  const playBeep = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';       // Dạng sóng (sine = tiếng 'tít' nhẹ, square = tiếng 'bíp' gắt)
    osc.frequency.value = 880; // Tần số (880Hz = Nốt La cao)
    
    // Hiệu ứng âm lượng tắt dần
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5); // Phát trong 0.5 giây
  };

  const triggerAlert = () => {
      // 1. Phát âm thanh Beep (nếu bật) - ĐÃ SỬA
      if (enableSound) {
        try {
          // Phát 3 tiếng bíp liên tục để gây chú ý
          playBeep();
          setTimeout(playBeep, 600);
          setTimeout(playBeep, 1200);
        } catch (e) {
          console.error("Lỗi phát âm thanh:", e);
        }
      }

      // 2. Gửi thông báo trình duyệt
      if (enableDesktop && Notification.permission === 'granted') {
        new Notification('⚠️ CẢNH BÁO Ô NHIỄM KHÔNG KHÍ!', {
          body: `Chỉ số AQI hiện tại là ${currentAQI}, vượt ngưỡng ${threshold} bạn đã đặt.`,
          icon: '/vite.svg',
          requireInteraction: true
        });
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* PHẦN HIỂN THỊ CẢNH BÁO TRỰC QUAN */}
      {currentAQI >= threshold ? (
        <div className="bg-red-600 text-white px-6 py-6 rounded-xl mb-8 animate-pulse shadow-md border-2 border-red-500">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full">
                <Bell className="w-8 h-8 text-red-600 animate-bounce" />
            </div>
            <div>
              <div className="font-bold text-2xl uppercase tracking-wider">Cảnh báo Ô nhiễm!</div>
              <div className="text-red-100 mt-1 text-lg">
                AQI hiện tại là <span className="font-bold text-white text-xl">{currentAQI}</span> (Vượt ngưỡng {threshold}).
                <br/>Hạn chế ra ngoài và đeo khẩu trang.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 text-green-800 px-6 py-4 rounded-xl mb-8 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
                <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-bold">Không khí an toàn</div>
              <div className="text-sm opacity-80">Chỉ số AQI hiện tại dưới ngưỡng cảnh báo của bạn.</div>
            </div>
          </div>
        </div>
      )}

      {/* PHẦN CẤU HÌNH CẢNH BÁO */}
      <div className="border-t border-gray-100 pt-6">
        <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-800">Cấu hình Cảnh báo</h2>
        </div>

        <div className="space-y-6">
            {/* Thanh trượt chọn ngưỡng */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex justify-between">
                    <span>Ngưỡng kích hoạt cảnh báo (AQI)</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
                        {threshold}
                    </span>
                </label>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500">Nhạy (50)</span>
                    <input
                        type="range"
                        min="50"
                        max="300"
                        step="10"
                        value={threshold}
                        onChange={(e) => setThreshold(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-xs text-gray-500">Ít nhạy (300)</span>
                </div>
            </div>

            {/* Các tùy chọn bật/tắt */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={requestNotificationPermission}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                        enableDesktop 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Bell className="w-4 h-4" />
                    {enableDesktop ? 'Đã bật thông báo Desktop' : 'Bật thông báo Desktop'}
                </button>

                <button
                    onClick={() => setEnableSound(!enableSound)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                        enableSound 
                        ? 'bg-purple-50 border-purple-200 text-purple-700 font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    {enableSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    {enableSound ? 'Đã bật âm thanh' : 'Bật âm thanh cảnh báo'}
                </button>
            </div>
        </div>
        
        <p className="text-xs text-gray-400 mt-6 text-center">
            * Cảnh báo sẽ hoạt động ngay trên trình duyệt này mà không cần đăng ký email.
        </p>
      </div>
    </div>
  );
}