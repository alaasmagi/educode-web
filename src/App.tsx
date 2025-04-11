import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitialSelectionView from "./screens/InitialSelectionView";
import HomeView from "./screens/HomeView";
import AttendancesView from "./screens/AttendancesView";
import CoursesView from "./screens/CoursesView";
import StatisticsView from "./screens/StatisticsView";
import SettingsView from "./screens/SettingsView";
import LoginView from "./screens/LoginView";
import CreateAccountView from "./screens/CreateAccountView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialSelectionView />} />
        <Route path="/Login/:successMessage?" element={<LoginView />} />
        <Route path="/CreateAccount" element={<CreateAccountView />} />
        <Route path="/Home" element={<HomeView />} />
        <Route path="/Courses/:status?/:courseId?" element={<CoursesView />} />
        <Route
          path="/Attendances/:status?/:attendanceId?"
          element={<AttendancesView />}
        />
        <Route
          path="/Statistics/:status?/:courseId?"
          element={<StatisticsView />}
        />
        <Route path="/Settings/:userId?" element={<SettingsView />} />
      </Routes>
    </Router>
  );
}

export default App;
