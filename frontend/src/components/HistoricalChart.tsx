import { useState, useRef, useEffect } from 'react';
import { HistoricalData } from '../types/aqi';

interface HistoricalChartProps {
  data: HistoricalData[];
  loading: boolean;
}

interface TooltipData {
  x: number;
  y: number;
  timestamp: string;
  pm25: number;
  aqi: number;
}

export function HistoricalChart({ data, loading }: HistoricalChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [offset, setOffset] = useState(0);

  // Sắp xếp dữ liệu theo thời gian
  const sortedData = [...data].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  useEffect(() => {
    if (!canvasRef.current || !sortedData.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    
    // Cấu hình Padding
    const padding = { top: 40, right: 100, bottom: 60, left: 60 }; // Tăng right để hiển thị nhãn ngưỡng
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const visibleData = sortedData.slice(
      Math.max(0, Math.floor(offset)),
      Math.min(sortedData.length, Math.ceil(offset + sortedData.length / zoomLevel))
    );

    if (visibleData.length === 0) return;

    const maxPM25 = Math.max(...visibleData.map(d => d.pm25), 80); // Min max là 80 để biểu đồ thoáng
    const minPM25 = 0;
    const pm25Range = maxPM25 - minPM25;

    // 1. Vẽ nền
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);

    // 2. Vẽ các đường phân ngưỡng (Threshold Lines) - ĐÃ KHÔI PHỤC
    const thresholds = [
      { value: 12, color: '#22c55e', label: 'Tốt' },       // Green
      { value: 35.4, color: '#eab308', label: 'Trung bình' }, // Yellow
      { value: 55.4, color: '#f97316', label: 'Kém' },     // Orange
      { value: 150.4, color: '#ef4444', label: 'Xấu' },    // Red
    ];

    thresholds.forEach(th => {
      // Chỉ vẽ nếu ngưỡng nằm trong phạm vi hiển thị
      if (th.value <= maxPM25) {
        const y = padding.top + chartHeight - ((th.value - minPM25) / pm25Range) * chartHeight;
        
        ctx.beginPath();
        ctx.strokeStyle = th.color;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]); // Nét đứt
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
        ctx.setLineDash([]); // Reset về nét liền

        // Vẽ nhãn ngưỡng bên phải
        ctx.fillStyle = th.color;
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${th.label} (${th.value})`, padding.left + chartWidth + 5, y);
      }
    });

    // 3. Vẽ lưới trục Y (Grid Lines)
    ctx.strokeStyle = '#d1d5db'; // Màu đậm hơn chút (#e5e7eb -> #d1d5db)
    ctx.lineWidth = 1;
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 5; i++) {
      const value = maxPM25 - (pm25Range / 5) * i;
      const y = padding.top + (chartHeight / 5) * i;
      
      // Chỉ vẽ đường lưới nếu nó không trùng quá gần với các đường ngưỡng (để đỡ rối)
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      // Giảm độ đậm của lưới thường
      ctx.globalAlpha = 0.5; 
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      ctx.fillText(value.toFixed(0), padding.left - 10, y);
    }

    // 4. Vẽ đường dữ liệu
    const stepX = chartWidth / (visibleData.length - 1 || 1);
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    visibleData.forEach((point, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartHeight - ((point.pm25 - minPM25) / pm25Range) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // 5. Vẽ điểm dữ liệu
    visibleData.forEach((point, i) => {
      const x = padding.left + stepX * i;
      const y = padding.top + chartHeight - ((point.pm25 - minPM25) / pm25Range) * chartHeight;
      
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 6. Vẽ nhãn trục X
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const maxLabels = Math.floor(chartWidth / 80);
    const labelStep = Math.ceil(visibleData.length / maxLabels);

    visibleData.forEach((point, i) => {
      if (i % labelStep === 0 || i === visibleData.length - 1) {
        const x = padding.left + stepX * i;
        const time = new Date(point.timestamp);
        ctx.fillText(
          time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          x,
          height - padding.bottom + 10
        );
      }
    });

    // 7. Vẽ Tiêu đề trục
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px sans-serif';
    
    ctx.save();
    ctx.translate(15, padding.top + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PM2.5 (µg/m³)', 0, 0);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Thời gian', padding.left + chartWidth / 2, height - 10);

  }, [sortedData, zoomLevel, offset]);

  // Mouse Move Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !sortedData.length) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = { top: 40, right: 100, bottom: 60, left: 60 };
    const chartWidth = rect.width - padding.left - padding.right;

    if (x < padding.left || x > rect.width - padding.right) {
      setTooltip(null);
      return;
    }

    const visibleData = sortedData.slice(
      Math.max(0, Math.floor(offset)),
      Math.min(sortedData.length, Math.ceil(offset + sortedData.length / zoomLevel))
    );

    const stepX = chartWidth / (visibleData.length - 1 || 1);
    const index = Math.round((x - padding.left) / stepX);

    if (index >= 0 && index < visibleData.length) {
      const point = visibleData[index];
      setTooltip({
        x: e.clientX,
        y: e.clientY,
        timestamp: new Date(point.timestamp).toLocaleString('vi-VN'),
        pm25: point.pm25,
        aqi: point.aqi_us
      });
    }
  };

  const handleMouseLeave = () => setTooltip(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoomLevel(prev => Math.max(1, Math.min(5, prev * delta)));
  };

  if (loading) return <div className="bg-white rounded-xl shadow-lg p-8 h-96 animate-pulse bg-gray-100"></div>;
  if (data.length === 0) return <div className="bg-white rounded-xl shadow-lg p-8 h-96 flex items-center justify-center text-gray-500">Chưa có dữ liệu</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Biểu đồ Xu hướng Lịch sử</h2>
        {zoomLevel > 1 && (
          <button onClick={() => { setZoomLevel(1); setOffset(0); }} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">Reset Zoom</button>
        )}
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onWheel={handleWheel}
        />
        {tooltip && (
          <div className="fixed bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl z-50 pointer-events-none" style={{ left: tooltip.x + 15, top: tooltip.y - 60 }}>
            <div className="text-xs mb-1 opacity-80">{tooltip.timestamp}</div>
            <div className="font-semibold">PM2.5: {tooltip.pm25.toFixed(1)}</div>
            <div className="text-sm">AQI: {tooltip.aqi}</div>
          </div>
        )}
      </div>
    </div>
  );
}