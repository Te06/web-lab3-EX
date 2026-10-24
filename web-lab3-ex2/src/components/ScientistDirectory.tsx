import { useId, useState } from 'react';

// Định nghĩa kiểu dữ liệu cho một nhà khoa học
interface Scientist {
  id: string;
  name: string;
  age: number;
  iq: number;
}

// Dữ liệu gốc ban đầu: 6 người của thầy + thêm mình vào cuối cùng
const INITIAL_PEOPLE: Scientist[] = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
  { id: 'sp-7', name: 'Pham Ngoc Thach', age: 20, iq: 500 },
];

export function ScientistDirectory() {
  // Dùng useId để tạo id ngẫu nhiên cho các input, giúp thẻ label dính chặt với input (chuẩn A11y)
  const searchId = useId();
  const iqId = useId();
  const sortId = useId();

  // State lưu danh sách người, đưa vào useState để có thể xoá và reset
  const [people, setPeople] = useState<Scientist[]>(INITIAL_PEOPLE);

  // State lưu các giá trị người dùng nhập vào
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState<'iq-desc' | 'age-asc'>('iq-desc');

  // Hàm tính toán danh sách hiển thị (Derived State)
  // Thầy dặn không dùng useEffect ở đây, cứ tính trực tiếp luôn cho nó mượt
  const visiblePeople = people
    // Lọc theo tên, đưa về chữ thường để không phân biệt hoa thường
    .filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    // Lọc theo mức IQ nhỏ nhất
    .filter((p) => p.iq >= minIq)
    // Sắp xếp, dùng toSorted để không làm thay đổi mảng gốc
    .toSorted((a, b) => {
      if (sortBy === 'iq-desc') return b.iq - a.iq; // IQ giảm dần
      return a.age - b.age; // Tuổi tăng dần
    });

  // Hàm xoá: Dùng filter tạo mảng mới chỉ chứa những người có id khác id cần xoá
  const handleDelete = (id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  };

  // Hàm reset: Gán lại mảng ban đầu
  const handleReset = () => {
    setPeople(INITIAL_PEOPLE);
  };

  return (
    <section aria-label="Pioneer Directory">
      <h2>Pioneer Directory</h2>

      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
      >
        <div>
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
            // Dùng valueAsNumber để lấy giá trị số, tránh lỗi cộng chuỗi
            onChange={(e) =>
              setMinIq(Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)
            }
          />
        </div>

        <div>
          <label htmlFor={sortId}>Sort By: </label>
          <select
            id={sortId}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'iq-desc' | 'age-asc')}
          >
            <option value="iq-desc">IQ (High to Low)</option>
            <option value="age-asc">Age (Youngest first)</option>
          </select>
        </div>

        <button type="button" onClick={handleReset} style={{ padding: '4px 8px' }}>
          Reset Data
        </button>
      </form>

      {/* Thẻ output này dùng để Screen Reader đọc số lượng cho người khiếm thị nghe */}
      <output
        role="status"
        aria-live="polite"
        style={{ display: 'block', marginBottom: '1rem', fontWeight: 'bold' }}
      >
        Found {visiblePeople.length} pioneers
      </output>

      <ul>
        {visiblePeople.map((p) => (
          <li key={p.id} style={{ marginBottom: '0.5rem' }}>
            {p.name} - Age: {p.age} - IQ: {p.iq}
            <button
              type="button"
              onClick={() => handleDelete(p.id)}
              style={{ marginLeft: '1rem', color: 'red', cursor: 'pointer' }}
              aria-label={`Delete ${p.name}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}