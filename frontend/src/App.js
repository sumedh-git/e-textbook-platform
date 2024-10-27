import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import CreateFaculty from "./components/CreateFaculty";
import CreateETextbook from "./components/CreateETextbook";
import AddChapter from "./components/AddChapter";
import FacultyDashboard from "./components/FacultyDashboard";
import ChangePassword from "./components/ChangePassword";
import FacultyActiveCourse from "./components/FacultyActiveCourse";

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
        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route
          path="/faculty/active-course"
          element={<FacultyActiveCourse />}
        />
        {/* <Route
          path="/faculty/evaluation-course"
          element={<EvaluationCourse />}
        />
        <Route path="/faculty/view-courses" element={<ViewCourses />} />
        <Route path="/faculty/change-password" element={<ChangePassword />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
