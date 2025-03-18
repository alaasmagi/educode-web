import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialSelectionView from "./screens/InitialSelectionView";
import HomeView from "./screens/HomeView";
import AttendancesView from "./screens/AttendancesView";
import CoursesView from "./screens/CoursesView";
import StatisticsView from "./screens/StatisticsView";
import SettingsView from "./screens/SettingsView";
import LoginView from "./screens/LoginView1";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialSelectionView />} />
        <Route path="/Login" element={<LoginView />} />
        <Route path="/Home" element={<HomeView />} />
        <Route path="/Courses" element={<CoursesView />} />
        <Route path="/Attendances" element={<AttendancesView />} />
        <Route path="/Statistics" element={<StatisticsView />} />
        <Route path="/Settings" element={<SettingsView />} />
      </Routes>
    </Router>
  );
}

export default App;
