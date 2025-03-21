import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Plateforme de Gestion des Examens
                </h1>
                <p className="text-xl text-gray-600">
                    Gérez vos examens en toute simplicité
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {!user ? (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Connexion</h2>
                            <p className="text-gray-600 mb-4">
                                Connectez-vous pour accéder à votre espace
                            </p>
                            <Link 
                                to="/login"
                                className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Se connecter
                            </Link>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Inscription</h2>
                            <p className="text-gray-600 mb-4">
                                Créez votre compte pour commencer
                            </p>
                            <Link 
                                to="/register"
                                className="block text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                            >
                                S'inscrire
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Mes Examens</h2>
                            <Link 
                                to="/examens"
                                className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            >
                                Voir les examens
                            </Link>
                        </div>
                        {user.role === 'enseignant' && (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h2 className="text-2xl font-semibold mb-4">Créer un Examen</h2>
                                <Link 
                                    to="/create-exam"
                                    className="block text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                                >
                                    Nouveau examen
                                </Link>
                            </div>
                        )}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
                            <Link 
                                to="/notifications"
                                className="block text-center bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                            >
                                Voir les notifications
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home; 