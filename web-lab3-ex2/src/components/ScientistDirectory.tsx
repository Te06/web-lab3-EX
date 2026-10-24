interface Scientist {
  id: string;
  name: string;
  age: number;
  iq: number;
}

// Data gốc: 6 người của thầy + 1 người là mày (id: sp-7)
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
  return (
    <section aria-label="Pioneer Directory">
      <h2>Pioneer Directory</h2>
      
      <ul>
        {SMART_PEOPLE.map((p) => (
          // Bắt buộc dùng key={p.id} để tối ưu reconciliation (không dùng index)
          <li key={p.id}>
            {p.name} - Age: {p.age} - IQ: {p.iq}
          </li>
        ))}
      </ul>
    </section>
  );
}