import { useId, useState } from 'react';

interface Scientist {
  id: string;
  name: string;
  age: number;
  iq: number;
}

// Vẫn giữ nguyên data 7 người (có mày)
const SMART_PEOPLE: Scientist[] = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
  { id: 'sp-7', name: 'Pham Ngoc Thach', age: 20, iq: 500 },
];

export function ScientistDirectory() {
  // 1. Tạo ID duy nhất cho các thẻ input
  const searchId = useId();
  const iqId = useId();
  const sortId = useId();

  // 2. Chỉ khai báo các state gốc (Raw state)
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState<'iq-desc' | 'age-asc'>('iq-desc');

  // 3. DERIVED STATE: Tính toán trực tiếp khi render (Không useEffect)
  const visiblePeople = SMART_PEOPLE
    // Bước 3.1: Lọc theo tên (không phân biệt hoa thường)
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    // Bước 3.2: Lọc theo IQ (lớn hơn hoặc bằng)
    .filter((p) => p.iq >= minIq)
    // Bước 3.3: Sắp xếp (Dùng toSorted để không làm hỏng mảng gốc)
    .toSorted((a, b) => {
      if (sortBy === 'iq-desc') return b.iq - a.iq; // IQ giảm dần
      return a.age - b.age; // Tuổi tăng dần
    });

  return (
    <section aria-label="Pioneer Directory">
      <h2>Pioneer Directory</h2>

      {/* Form điều khiển */}
      <form role="search" onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          {/* Dùng htmlFor liên kết với ID tự sinh */}
          <label htmlFor={searchId}>Search Name: </label>
          <input 
            id={searchId} 
            type="search" 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
          />
        </div>

        <div>
          <label htmlFor={iqId}>Minimum IQ: </label>
          <input 
            id={iqId} 
            type="number" 
            value={minIq} 
            // Dùng valueAsNumber để lấy số, tránh lỗi chuỗi
            onChange={(e) => setMinIq(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)} 
          />
        </div>

        <div>
          <label htmlFor={sortId}>Sort By: </label>
          <select id={sortId} value={sortBy} onChange={(e) => setSortBy(e.target.value as 'iq-desc' | 'age-asc')}>
            <option value="iq-desc">IQ (High to Low)</option>
            <option value="age-asc">Age (Youngest first)</option>
          </select>
        </div>
      </form>

      {/* Thông báo số lượng (A11y) */}
      <output role="status" aria-live="polite" style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}>
        Found {visiblePeople.length} pioneers
      </output>

      {/* Hiển thị danh sách đã được lọc */}
      <ul>
        {visiblePeople.map((p) => (
          <li key={p.id}>
            {p.name} - Age: {p.age} - IQ: {p.iq}
          </li>
        ))}
      </ul>
    </section>
  );
}