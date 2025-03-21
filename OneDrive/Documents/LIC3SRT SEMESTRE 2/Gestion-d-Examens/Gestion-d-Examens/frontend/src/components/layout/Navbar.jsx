import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <ul className="flex space-x-4">
                    <li><Link to="/" className="hover:text-gray-300">Accueil</Link></li>
                    <li><Link to="/examens" className="hover:text-gray-300">Examens</Link></li>
                    <li><Link to="/notifications" className="hover:text-gray-300">Notifications</Link></li>
                    {user?.role === 'enseignant' && (
                        <li><Link to="/create-exam" className="hover:text-gray-300">Créer un examen</Link></li>
                    )}
                </ul>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span>{user.email}</span>
                            <button 
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                            >
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="hover:text-gray-300">Connexion</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 