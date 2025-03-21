import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import ExamList from './components/ExamList';
import CreateExam from './components/CreateExam';
import NotificationList from './components/NotificationList';
import UnauthorizedPage from './components/auth/UnauthorizedPage';
import Home from './components/Home';
import Register from './components/auth/Register';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto py-8 px-4">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/unauthorized" element={<UnauthorizedPage />} />
                            <Route
                                path="/create-exam"
                                element={
                                    <PrivateRoute allowedRoles={['enseignant']}>
                                        <CreateExam />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/examens"
                                element={
                                    <PrivateRoute allowedRoles={['enseignant', 'etudiant']}>
                                        <ExamList />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/notifications"
                                element={
                                    <PrivateRoute allowedRoles={['enseignant', 'etudiant']}>
                                        <NotificationList />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App; 