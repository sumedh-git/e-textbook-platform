import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
                <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/student/login" element={<StudentLogin />} />
                <Route path="/student/enroll" element={<StudentEnroll />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route
                path="/faculty/active-course"
                element={<FacultyActiveCourse />}
                />
                <Route
                path="/faculty/evaluation-course"
                element={<FacultyEvaluationCourse />}
                />
                <Route path="/faculty/view-courses" element={<FacultyViewCourses />} />
                        {/* Add routes for other admin functionalities */}
                    </Routes>
        </Router>
    );
}

export default App;
