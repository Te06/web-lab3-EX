// Khai báo kiểu dữ liệu cho một đội tuyển
export interface SquadData {
  id: string;
  name: string;
  map: string;
  phase: string;
  alive: number;
  kills: number;
  wwcdProb: string;
  status: string;
}

// Dữ liệu giả lập của 3 đội PUBG Việt Nam
const PUBG_VN_SQUADS: SquadData[] = [
  { id: 'ces', name: 'Cerberus Esports', map: 'Erangel', phase: 'Phase 6', alive: 4, kills: 14, wwcdProb: '68%', status: 'In Safe Zone' },
  { id: 'te', name: 'The Expendables', map: 'Miramar', phase: 'Phase 7', alive: 4, kills: 18, wwcdProb: '82%', status: 'Holding High Ground' },
  { id: 'ge', name: 'Genius Esports', map: 'Taego', phase: 'Phase 5', alive: 3, kills: 9, wwcdProb: '41%', status: 'Rotating Blue Zone' },
];

// Hàm giả lập gọi API
export function fetchKraftonPubgTelemetry(squadId: string, options: { signal: AbortSignal }): Promise<SquadData> {
  return new Promise((resolve, reject) => {
    // Giả lập thời gian chờ mạng là 1.5 giây
    const timer = setTimeout(() => {
      // Mô phỏng 35% bị rớt mạng (packet loss)
      const isPacketLoss = Math.random() < 0.35;
      
      if (isPacketLoss) {
        reject(new Error('Mất kết nối vệ tinh (Packet Loss)!'));
        return;
      }

      const squad = PUBG_VN_SQUADS.find((s) => s.id === squadId);
      if (squad) {
        resolve(squad);
      } else {
        reject(new Error('Không tìm thấy đội này.'));
      }
    }, 1500);

    // Nếu có tín hiệu AbortController (người dùng bấm đổi đội giữa chừng), hủy timer và báo lỗi AbortError
    options.signal.addEventListener('abort', () => {
      clearTimeout(timer);
      const abortError = new Error('Đã hủy request');
      abortError.name = 'AbortError';
      reject(abortError);
    });
  });
}