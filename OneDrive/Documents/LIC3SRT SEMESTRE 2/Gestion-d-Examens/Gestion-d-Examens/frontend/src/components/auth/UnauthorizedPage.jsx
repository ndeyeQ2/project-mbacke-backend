import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">Accès non autorisé</h1>
                <p className="text-gray-600 mb-4">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                </p>
                <Link 
                    to="/" 
                    className="text-blue-500 hover:text-blue-600 underline"
                >
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage; 