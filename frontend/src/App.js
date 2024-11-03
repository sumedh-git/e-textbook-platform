import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import CreateFaculty from './components/CreateFaculty';
import CreateETextbook from './components/CreateETextbook';
import AddChapter from './components/AddChapter';
import AddSection from './components/AddSection';
import AddContentBlockSelection from './components/AddContentBlockSelection';
import AddContentBlock from './components/AddContentBlock';
import AddActivity from './components/AddActivity';
import FacultyDashboard from './components/FacultyDashboard'
import ChangePassword from './components/ChangePassword'
import FacultyActiveCourse from './components/FacultyActiveCourse'
import FacultyEvaluationCourse from './components/FacultyEvaluationCourse'
import FacultyViewCourses from './components/FacultyViewCourses'
import StudentLogin  from './components/StudentLogin';
import StudentEnroll from './components/StudentEnroll';
import StudentDashboard from './components/Student Dashboard';
import AddQuestion from './components/AddQuestion';
import ModifyETextbook from './components/ModifyETextbook';
import ModifyChapter from './components/ModifyChapter';
import ModifySection from './components/ModifySection';
import ModifyContentBlockSelection from './components/ModifyContentBlockSelection';
import ModifyContentBlock from './components/ModifyContentBlock';
import ModifyActivity from './components/ModifyActivity';
import ModifyQuestion from './components/ModifyQuestion';
import TADashboard from "./components/TADashboard";
import TAViewCourses from "./components/TAViewCourses";
import TAActiveCourse from "./components/TAActiveCourse";
import TAViewStudents from "./components/TAViewStudents";
import FacultyViewStudents from "./components/FacultyViewStudents";
import StudentViewSection from "./components/StudentViewSection";
import StudentViewBlock from "./components/StudentViewBlock";
import StudentViewParticipationActivityPoints from "./components/StudentViewParticipationActivityPoints";

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
                <Route path="/admin/add-content-block-selection" element={<AddContentBlockSelection />} />
                <Route path="/admin/add-content-block" element={<AddContentBlock />} />
                <Route path="/admin/add-activity" element={<AddActivity />} />
                <Route path="/admin/add-question" element={<AddQuestion />} />
                <Route path="/admin/modify-etextbook" element={<ModifyETextbook />} />
                <Route path="/admin/modify-chapter" element={<ModifyChapter />} />
                <Route path="/admin/modify-section" element={<ModifySection />} />
                <Route path="/admin/modify-content-block-selection" element={<ModifyContentBlockSelection />} />
                <Route path="/admin/modify-content-block" element={<ModifyContentBlock />} />
                <Route path="/admin/modify-activity" element={<ModifyActivity />} />
                <Route path="/admin/modify-question" element={<ModifyQuestion />} />
                <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/enroll" element={<StudentEnroll />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/student/view-section" element={<StudentViewSection />} />
                <Route path="/student/view-block" element={<StudentViewBlock />} />
                <Route path="/student/view-participation-activity-points" element={<StudentViewParticipationActivityPoints />} />
                <Route
                path="/faculty/active-course"
                element={<FacultyActiveCourse />}
                />
                <Route
                path="/faculty/evaluation-course"
                element={<FacultyEvaluationCourse />}
                />
                <Route path="/faculty/view-courses" element={<FacultyViewCourses />} />
                <Route path="/faculty/view-students" element={<FacultyViewStudents />} />

                <Route path="/dashboard/ta" element={<TADashboard />} />
                <Route path="/ta/view-courses" element={<TAViewCourses />} />
                <Route path="/ta/active-course" element={<TAActiveCourse />} />
                <Route path="/ta/view-students" element={<TAViewStudents />} />
          </Routes>
        </Router>
    );
}

export default App;