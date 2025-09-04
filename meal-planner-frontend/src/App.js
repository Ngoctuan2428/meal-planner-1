import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkoutPlan from './pages/WorkoutPlan';
import History from './pages/History';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workout-plan" element={<WorkoutPlan />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
