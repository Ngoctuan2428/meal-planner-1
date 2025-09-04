import '../styles/HistoryItem.scss';

const HistoryItem = ({ item, type }) => {
  const formattedDate = new Date(item.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="history-item">
      <div className="history-content">
        <h4 className="item-name">{item.name}</h4>

        {item.calories && (
          <p className="item-calories">
            🔥 {item.calories} calo
          </p>
        )}

        {item.duration && (
          <p className="item-duration">
            ⏱ {item.duration} phút
          </p>
        )}

        <p className="item-date">🗓 {formattedDate}</p>
      </div>
    </div>
  );
};

export default HistoryItem;
