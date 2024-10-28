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
                {/* Add routes for other admin functionalities */}
            </Routes>
        </Router>
    );
}

export default App;
