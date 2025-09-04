import React, { useState } from "react";
import { generateWorkoutPlan } from "../services/api";
import "../styles/WorkoutPlan.scss";

const WorkoutPlan = () => {
  const [goalType, setGoalType] = useState("lose");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("kg");
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateWorkout = async () => {
    if (!amount || Number(amount) <= 0) {
      setError("Vui lòng nhập số lượng mục tiêu hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await generateWorkoutPlan({
        userId: 1, // TODO: Lấy từ thông tin user thật
        goalType,
        amount,
        unit,
      });

      if (res.data?.workouts?.length) {
        setWorkoutPlan(res.data.workouts);
      } else {
        setWorkoutPlan([]);
        setError("Không tìm thấy kế hoạch tập luyện phù hợp");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi gọi API");
      setWorkoutPlan([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-container">
      <h2 className="title">💪 Lên kế hoạch tập luyện</h2>

      <div className="form-card">
        <div className="form-row">
          <select
            value={goalType}
            onChange={(e) => setGoalType(e.target.value)}
          >
            <option value="lose">Giảm cân</option>
            <option value="gain">Tăng cân</option>
            <option value="muscle">Tăng cơ</option>
          </select>

          <input
            type="number"
            placeholder="Số lượng (vd: 5)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />

          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="kg">kg</option>
            <option value="%">%</option>
          </select>
        </div>

        {error && <div className="error-text">{error}</div>}

        <button
          className="generate-button"
          onClick={handleGenerateWorkout}
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo kế hoạch tập luyện"}
        </button>
      </div>

      <div className="workout-list">
        {workoutPlan.length > 0 ? (
          workoutPlan.map((workout, index) => (
            <div className="workout-card" key={index}>
              {workout.image && (
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="workout-image"
                />
              )}
              <div className="workout-info">
                <h3 className="workout-name">{workout.name}</h3>
                <p className="workout-description">{workout.description}</p>
                {workout.duration && (
                  <p className="workout-duration">⏱ {workout.duration}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="no-plan">Chưa có kế hoạch nào được tạo.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlan;
