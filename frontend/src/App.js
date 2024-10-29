import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CreateFaculty from "./components/CreateFaculty";
import CreateETextbook from "./components/CreateETextbook";
import AddChapter from "./components/AddChapter";
import AddSection from "./components/AddSection";
import AddContentBlockSelection from "./components/AddContentBlockSelection";
import AddContentBlock from "./components/AddContentBlock";
import AddActivity from "./components/AddActivity";
import FacultyDashboard from "./components/FacultyDashboard";
import ChangePassword from "./components/ChangePassword";
import FacultyActiveCourse from "./components/FacultyActiveCourse";
import FacultyEvaluationCourse from "./components/FacultyEvaluationCourse";
import FacultyViewCourses from "./components/FacultyViewCourses";
import TADashboard from "./components/TADashboard";
import TAViewCourses from "./components/TAViewCourses";
import TAActiveCourse from "./components/TAActiveCourse";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-faculty" element={<CreateFaculty />} />
        <Route path="/admin/create-etextbook" element={<CreateETextbook />} />
        <Route path="/admin/add-chapter" element={<AddChapter />} />
        <Route path="/admin/add-section" element={<AddSection />} />
        <Route
          path="/admin/add-content-block-selection"
          element={<AddContentBlockSelection />}
        />
        <Route path="/admin/add-content-block" element={<AddContentBlock />} />
        <Route path="/admin/add-activity" element={<AddActivity />} />

        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/faculty/active-course"
          element={<FacultyActiveCourse />}
        />
        <Route
          path="/faculty/evaluation-course"
          element={<FacultyEvaluationCourse />}
        />
        <Route path="/faculty/view-courses" element={<FacultyViewCourses />} />

        <Route path="/dashboard/ta" element={<TADashboard />} />
        <Route path="/ta/view-courses" element={<TAViewCourses />} />
        <Route path="/ta/active-course" element={<TAActiveCourse />} />
      </Routes>
    </Router>
  );
}

export default App;
