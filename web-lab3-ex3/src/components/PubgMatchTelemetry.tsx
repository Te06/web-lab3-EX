import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../api/pubg-api';
import type { SquadData } from '../api/pubg-api';

// Định nghĩa 4 trạng thái của máy trạng thái (State Machine)
type ViewState = 
  | { status: 'IDLE'; data: null; error: null }
  | { status: 'LOADING'; data: null; error: null }
  | { status: 'SUCCESS'; data: SquadData; error: null }
  | { status: 'ERROR'; data: null; error: string };

export function PubgMatchTelemetry() {
  // Mặc định chọn đội The Expendables (te)
  const [squadId, setSquadId] = useState('te');
  
  // Khởi tạo state ban đầu là IDLE
  const [view, setView] = useState<ViewState>({ status: 'IDLE', data: null, error: null });
  
  // Biến này dùng để bấm nút "Thử lại" (Retry)
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    // 1. Tạo một AbortController mới mỗi khi useEffect chạy
    const controller = new AbortController();

    // 2. Chuyển trạng thái sang LOADING
    setView({ status: 'LOADING', data: null, error: null });

    // 3. Gọi API (truyền signal vào để có thể hủy)
    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => {
        // Tải xong thì chuyển sang SUCCESS và lưu data
        setView({ status: 'SUCCESS', data, error: null });
      })
      .catch((err) => {
        // Nếu lỗi do người dùng bấm đổi đội (AbortError) thì bỏ qua, không báo lỗi lên UI
        if (err.name === 'AbortError') return;
        
        // Lỗi thật (rớt mạng) thì chuyển sang trạng thái ERROR
        setView({ status: 'ERROR', data: null, error: err.message });
      });

    // 4. Hàm cleanup: Khi squadId thay đổi, hàm này chạy để hủy request cũ
    return () => controller.abort();
  }, [squadId, retryTick]);

  return (
    <section aria-label="PUBG Telemetry">
      <h2>KRAFTON PUBG VN Live Telemetry</h2>
      
      {/* Nút chọn đội */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
        <button onClick={() => setSquadId('ces')} type="button">Cerberus Esports</button>
        <button onClick={() => setSquadId('te')} type="button">The Expendables</button>
        <button onClick={() => setSquadId('ge')} type="button">Genius Esports</button>
      </div>

      {/* Render UI dựa trên State */}
      {view.status === 'LOADING' && <p>Đang tải dữ liệu vệ tinh...</p>}
      
      {view.status === 'SUCCESS' && (
        <article>
          <h3>{view.data.name} - {view.data.map}</h3>
          <p>Kills: {view.data.kills} | Alive: {view.data.alive}</p>
          <p>Status: {view.data.status}</p>
        </article>
      )}

      {view.status === 'ERROR' && (
        <div style={{ color: 'red' }}>
          <p>Lỗi: {view.error}</p>
          <button onClick={() => setRetryTick((t) => t + 1)}>Kết nối lại</button>
        </div>
      )}
    </section>
  );
}