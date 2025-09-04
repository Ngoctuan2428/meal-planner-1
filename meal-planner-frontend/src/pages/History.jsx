import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/api';
import HistoryItem from '../components/HistoryItem';
import '../styles/History.scss';

const History = () => {
  const [history, setHistory] = useState({ meals: [], workouts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Lấy userId từ localStorage và ép kiểu an toàn
  const storedId = localStorage.getItem('userId');
  const userId = Number(storedId) || null;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setError('⚠ Bạn cần đăng nhập để xem lịch sử.');
        setLoading(false);
        return;
      }

      try {
        const res = await getHistory(userId);

        // Đảm bảo dữ liệu hợp lệ
        const meals = Array.isArray(res?.data?.meals) ? res.data.meals : [];
        const workouts = Array.isArray(res?.data?.workouts) ? res.data.workouts : [];

        setHistory({ meals, workouts });
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử:', err);
        setError('Không thể tải dữ liệu lịch sử. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  // Trạng thái loading
  if (loading) {
    return <div className="history-container">⏳ Đang tải dữ liệu...</div>;
  }

  // Trạng thái lỗi
  if (error) {
    return (
      <div className="history-container error-message">
        {error}
        {!userId && (
          <button
            className="login-btn"
            onClick={() => navigate('/login')}
            style={{ marginTop: '10px' }}
          >
            Đăng nhập ngay
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2 className="history-title">📜 Lịch sử hoạt động của bạn</h2>

      {/* Lịch sử bữa ăn */}
      <div className="history-section">
        <h3 className="section-title">🍱 Lịch sử bữa ăn</h3>
        {history.meals.length > 0 ? (
          history.meals.map((item, idx) => (
            <HistoryItem
              key={item.id || `meal-${idx}`}
              item={item}
              type="meal"
            />
          ))
        ) : (
          <p className="no-history">Không có dữ liệu bữa ăn.</p>
        )}
      </div>

      {/* Lịch sử tập luyện */}
      <div className="history-section">
        <h3 className="section-title">💪 Lịch sử tập luyện</h3>
        {history.workouts.length > 0 ? (
          history.workouts.map((item, idx) => (
            <HistoryItem
              key={item.id || `workout-${idx}`}
              item={item}
              type="workout"
            />
          ))
        ) : (
          <p className="no-history">Không có dữ liệu tập luyện.</p>
        )}
      </div>
    </div>
  );
};

export default History;
