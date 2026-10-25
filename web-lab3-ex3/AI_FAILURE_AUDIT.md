# AI Failure Mode Audit - Exercise 3

Báo cáo này tổng hợp 3 lỗi phổ biến mà AI (như ChatGPT, Copilot) thường sinh ra khi viết code React 19, cách em phát hiện và sửa lại theo chuẩn.

## 1. Lỗi Derived State (Sử dụng useEffect thừa thãi)
- **Vulnerability:** Gây ra hiện tượng Double Render (Render 2 lần) làm giao diện bị giật lag.
- **AI Prompt:** "Viết hàm tìm kiếm và lọc danh sách người dùng trong React".
- **AI Generated Code:** 
  const [search, setSearch] = useState('');
  const [filteredList, setFilteredList] = useState(data);
  useEffect(() => {
    setFilteredList(data.filter(item => item.name.includes(search)));
  }, [search]);
- **Risk:** Khi người dùng gõ 1 phím, React render lần 1 với data cũ, sau đó useEffect chạy và cập nhật state, buộc React phải render lần 2. Nếu danh sách dài, app sẽ bị giật.
- **Detection Method:** Dùng React DevTools Profiler, thấy số lần render tăng gấp đôi mỗi khi gõ phím.
- **Engineering Refactor:** Bỏ state phụ, tính toán trực tiếp khi render.
  const filteredList = data.filter(item => item.name.includes(search));

## 2. Lỗi Stale Closure trong AbortController (Rò rỉ bộ nhớ)
- **Vulnerability:** Request cũ chạy xong đè lên dữ liệu mới, gây hiển thị sai thông tin (Race Condition).
- **AI Prompt:** "Gọi API lấy thông tin đội tuyển mỗi khi người dùng click chọn đội".
- **AI Generated Code:**
  useEffect(() => {
    fetch(`/api/squad/${squadId}`).then(res => res.json()).then(data => setData(data));
  }, [squadId]);
- **Risk:** Người dùng bấm đổi đội liên tục, API của đội A trả về chậm hơn đội B. Dù đang chọn đội B, dữ liệu của đội A vẫn đè lên màn hình. Ngoài ra khi component unmount, fetch vẫn tiếp tục chạy ngầm.
- **Detection Method:** Mở tab Network, chọn chế độ Slow 3G, bấm đổi đội liên tục. Thấy các request cũ vẫn hoàn thành với trạng thái 200 thay vì bị hủy (canceled).
- **Engineering Refactor:** Dùng AbortController và check lỗi AbortError trong cleanup.
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/squad/${squadId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => { if (err.name !== 'AbortError') console.error(err); });
    return () => controller.abort();
  }, [squadId]);

## 3. Lỗi Boolean Soup trong State Machine
- **Vulnerability:** Quản lý trạng thái rời rạc bằng nhiều biến boolean dẫn đến xung đột logic.
- **AI Prompt:** "Hiển thị trạng thái đang tải, lỗi hoặc thành công khi gọi API".
- **AI Generated Code:**
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
- **Risk:** Nếu mạng lag, cả isLoading và isError có thể cùng bằng true tại một thời điểm, khiến UI hiển thị lỗi lẫn lộn (vừa quay quay vừa báo lỗi).
- **Detection Method:** Giả lập mạng chập chờn, kiểm tra các trường hợp biên (edge cases).
- **Engineering Refactor:** Gộp thành một cục State Machine duy nhất.
  const [view, setView] = useState({ status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' });