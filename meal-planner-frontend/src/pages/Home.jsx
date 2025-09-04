import { useState } from 'react';
import { generateMeals, estimateCaloriesFromText, estimateCaloriesFromImage } from '../services/api';
import '../styles/Home.scss';

const Home = () => {
  const [calorieTarget, setCalorieTarget] = useState('');
  const [numMeals, setNumMeals] = useState('3');
  const [meals, setMeals] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [estimatedCalories, setEstimatedCalories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Gọi API tạo thực đơn
  const handleGenerateMeals = async () => {
    if (!calorieTarget) return setError('Vui lòng nhập số calo.');
    setLoading(true);
    setError('');
    try {
      const res = await generateMeals({
        calorieTarget: Number(calorieTarget),
        numMeals: Number(numMeals),
        userId: 1
      });
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error(err);
      setError('Không thể tạo thực đơn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API ước lượng calo từ mô tả
  const handleEstimateText = async () => {
    if (!description.trim()) return setError('Vui lòng nhập mô tả món ăn.');
    setLoading(true);
    setError('');
    try {
      const res = await estimateCaloriesFromText({ description });
      setEstimatedCalories(res.data.calories);
    } catch (err) {
      console.error(err);
      setError('Không thể ước lượng calo từ mô tả.');
    } finally {
      setLoading(false);
    }
  };

  // Gọi API ước lượng calo từ ảnh
  const handleEstimateImage = async () => {
    if (!image) return setError('Vui lòng chọn ảnh món ăn.');
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', image);
      const res = await estimateCaloriesFromImage(formData);
      setEstimatedCalories(res.data.calories);
    } catch (err) {
      console.error(err);
      setError('Không thể ước lượng calo từ ảnh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {error && <div className="error-message">{error}</div>}

      {/* Phần tạo thực đơn */}
      <div className="meal-generator">
        <h2>Hãy để chế độ ăn của bạn <span>Tự động</span>.</h2>
        <p className="subtitle">Tạo thực đơn của bạn chỉ trong vài giây</p>

        <div className="inputs">
          <label>Tôi muốn ăn</label>
          <input
            type="number"
            placeholder="Số calo"
            value={calorieTarget}
            onChange={(e) => setCalorieTarget(e.target.value)}
          />

          <label>trong</label>
          <select value={numMeals} onChange={(e) => setNumMeals(e.target.value)}>
            {[1, 2, 3, 4].map(n => (
              <option key={n} value={n}>{n} bữa ăn</option>
            ))}
          </select>

          <button
            className="generate-button"
            onClick={handleGenerateMeals}
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Tạo thực đơn'}
          </button>
        </div>

        {meals.length > 0 && (
          <div className="meal-plan">
            {meals.map((meal, idx) => (
              <div key={idx} className="meal-section">
                <h3>{meal.type} - {meal.totalCalories} Calo</h3>
                <ul>
                  {meal.items.map((item, index) => (
                    <li key={index} className="meal-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p className="item-name">{item.name}</p>
                        <p className="item-serving">{item.servings} khẩu phần</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phần ước lượng calo */}
      <div className="calorie-estimator">
        <h2>Ước lượng calo</h2>
        <input
          placeholder="Mô tả món ăn"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleEstimateText} disabled={loading}>
          {loading ? 'Đang ước lượng...' : 'Từ mô tả'}
        </button>

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={handleEstimateImage} disabled={loading}>
          {loading ? 'Đang ước lượng...' : 'Từ ảnh'}
        </button>

        {estimatedCalories !== null && (
          <div className="result">Ước lượng: {estimatedCalories} kcal</div>
        )}
      </div>
    </div>
  );
};

export default Home;
