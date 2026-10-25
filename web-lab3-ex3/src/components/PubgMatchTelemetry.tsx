import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from '../api/pubg-api';
import type { SquadData } from '../api/pubg-api';
import styles from './PubgMatchTelemetry.module.css';

// Định nghĩa 4 trạng thái
type ViewState = 
  | { status: 'IDLE'; data: null; error: null }
  | { status: 'LOADING'; data: null; error: null }
  | { status: 'SUCCESS'; data: SquadData; error: null }
  | { status: 'ERROR'; data: null; error: string };

export function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState('te');
  const [view, setView] = useState<ViewState>({ status: 'IDLE', data: null, error: null });
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => {
        setView({ status: 'SUCCESS', data, error: null });
      })
      .catch((err) => {
        // Nếu là lỗi do mình chủ động đổi đội (AbortError) thì bỏ qua không báo lỗi
        if (err.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: err.message });
      });

    return () => controller.abort();
  }, [squadId, retryTick]);

  return (
    <section aria-label="PUBG Telemetry">
      <h2>KRAFTON PUBG VN Live Telemetry</h2>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
        <button onClick={() => setSquadId('ces')} type="button">Cerberus Esports</button>
        <button onClick={() => setSquadId('te')} type="button">The Expendables</button>
        <button onClick={() => setSquadId('ge')} type="button">Genius Esports</button>
      </div>

      {/* Trạng thái đang tải: Hiển thị Skeleton UI */}
      {view.status === 'LOADING' && (
        <section className={styles.skeleton} aria-busy="true" aria-label="Đang tải dữ liệu">
          Đang đồng bộ vệ tinh...
        </section>
      )}
      
      {/* Trạng thái thành công: Hiển thị thông tin đội */}
      {view.status === 'SUCCESS' && (
        <article className={styles.successCard}>
          <h3>{view.data.name} - Map: {view.data.map}</h3>
          <p>Vòng: {view.data.phase} | Sinh tồn: {view.data.alive}</p>
          <p>Hạ gục: {view.data.kills} | Tỉ lệ WWCD: {view.data.wwcdProb}</p>
          <p>Trạng thái: {view.data.status}</p>
        </article>
      )}

      {/* Trạng thái lỗi: Dùng thẻ section với role="alert" thay cho window.alert */}
      {view.status === 'ERROR' && (
        <section role="alert" className={styles.errorBox}>
          <p>Lỗi kết nối: {view.error}</p>
          <button type="button" onClick={() => setRetryTick((t) => t + 1)}>
            Kết nối lại vệ tinh
          </button>
        </section>
      )}
    </section>
  );
}