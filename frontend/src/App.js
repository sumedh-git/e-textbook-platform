import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
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
import AddQuestion from "./components/AddQuestion";
import ModifyETextbook from "./components/ModifyETextbook";
import ModifyChapter from "./components/ModifyChapter";
import ModifySection from "./components/ModifySection";
import ModifyContentBlockSelection from "./components/ModifyContentBlockSelection";
import ModifyContentBlock from "./components/ModifyContentBlock";
import ModifyActivity from "./components/ModifyActivity";
import ModifyQuestion from "./components/ModifyQuestion";
import TADashboard from "./components/TADashboard";
import TAViewCourses from "./components/TAViewCourses";
import TAActiveCourse from "./components/TAActiveCourse";
import TAViewStudents from "./components/TAViewStudents";
import FacultyViewStudents from "./components/FacultyViewStudents";
import CreateActiveCourse from "./components/CreateActiveCourse";
import CreateEvaluationCourse from "./components/CreateEvaluationCourse";
import FacultyModifyChapter from "./components/FacultyModifyChapter";
import FacultyHideChapter from "./components/FacultyHideChapter";
import FacultyDeleteChapter from "./components/FacultyDeleteChapter";
import FacultyAddTa from "./components/FacultyAddTa";
import FacultyModifySection from "./components/FacutlyModifySection";
import FacultyHideSection from "./components/FacultyHideSection";
import FacultyDeleteSection from "./components/FacultyDeleteSection";
import FacultyModifyContentBlock from "./components/FacultyModifyContentBlock";
import FacultyHideContentBlock from "./components/FacultyHideContentBlock";
import FacultyDeleteContentBlock from "./components/FacultyDeleteContentBlock";
import FacultyHideActivity from "./components/FacultyHideActivity";
import FacultyDeleteActivity from "./components/FacultyDeleteActivity";
import TAModifyChapter from "./components/TAModifyChapter";
import TAHideChapter from "./components/TAHideChapter";
import TADeleteChapter from "./components/TADeleteChapter";
import TADeleteSection from "./components/TADeleteSection";
import TADeleteContentBlock from "./components/TADeleteContentBlock";
import TADeleteActivity from "./components/TADeleteActivity";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/admin/create-faculty" element={<CreateFaculty />} />
        <Route path="/admin/create-etextbook" element={<CreateETextbook />} />
        <Route path="/:role/add-chapter" element={<AddChapter />} />
        <Route path="/:role/add-section" element={<AddSection />} />
        <Route
          path="/:role/add-content-block-selection"
          element={<AddContentBlockSelection />}
        />
        <Route path="/:role/add-content-block" element={<AddContentBlock />} />
        <Route path="/:role/add-activity" element={<AddActivity />} />
        <Route path="/:role/add-question" element={<AddQuestion />} />
        <Route path="/admin/modify-etextbook" element={<ModifyETextbook />} />
        <Route path="/admin/modify-chapter" element={<ModifyChapter />} />
        <Route path="/admin/modify-section" element={<ModifySection />} />
        <Route
          path="/admin/modify-content-block-selection"
          element={<ModifyContentBlockSelection />}
        />
        <Route
          path="/admin/modify-content-block"
          element={<ModifyContentBlock />}
        />
        <Route path="/admin/modify-activity" element={<ModifyActivity />} />
        <Route path="/admin/modify-question" element={<ModifyQuestion />} />
        <Route
          path="/admin/create-active-course"
          element={<CreateActiveCourse />}
        />
        <Route
          path="/admin/create-evaluation-course"
          element={<CreateEvaluationCourse />}
        />

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
        <Route
          path="/faculty/modify-chapter"
          element={<FacultyModifyChapter />}
        />
        <Route path="/faculty/hide-chapter" element={<FacultyHideChapter />} />
        <Route
          path="/faculty/delete-chapter"
          element={<FacultyDeleteChapter />}
        />
        <Route
          path="/faculty/modify-section"
          element={<FacultyModifySection />}
        />
        <Route path="/faculty/hide-section" element={<FacultyHideSection />} />
        <Route
          path="/faculty/delete-section"
          element={<FacultyDeleteSection />}
        />
        <Route
          path="/faculty/modify-content-block"
          element={<FacultyModifyContentBlock />}
        />
        <Route
          path="/faculty/hide-content-block"
          element={<FacultyHideContentBlock />}
        />
        <Route
          path="/faculty/delete-content-block"
          element={<FacultyDeleteContentBlock />}
        />
        <Route
          path="/faculty/hide-activity"
          element={<FacultyHideActivity />}
        />
        <Route
          path="/faculty/delete-activity"
          element={<FacultyDeleteActivity />}
        />
        <Route path="/faculty/view-courses" element={<FacultyViewCourses />} />
        <Route
          path="/faculty/view-students"
          element={<FacultyViewStudents />}
        />
        <Route path="/faculty/add-ta" element={<FacultyAddTa />} />

        <Route path="/dashboard/ta" element={<TADashboard />} />
        <Route path="/ta/view-courses" element={<TAViewCourses />} />
        <Route path="/ta/active-course" element={<TAActiveCourse />} />
        <Route path="/ta/view-students" element={<TAViewStudents />} />
        <Route path="/ta/modify-chapter" element={<TAModifyChapter />} />
        <Route path="/ta/hide-chapter" element={<TAHideChapter />} />
        <Route path="/ta/delete-chapter" element={<TADeleteChapter />} />
        <Route path="/ta/delete-section" element={<TADeleteSection />} />
        <Route
          path="/ta/delete-content-block"
          element={<TADeleteContentBlock />}
        />
        <Route path="/ta/delete-activity" element={<TADeleteActivity />} />
      </Routes>
    </Router>
  );
}

export default App;
