import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        motDePasse: '',
        role: 'etudiant' // 'etudiant' ou 'enseignant'
    });
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    let url = `${baseURL}/api/etudiants/login`;

    // let url = '/api/etudiants/login'; // ✅ Changement de const à let
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (credentials.role === 'enseignant') { // ✅ Correction ici
            // url = '/api/enseignants/login';
            url = `${baseURL}/api/enseignants/login`;
        }

        const Login1 = {
            email: credentials.email,
            motDePasse: credentials.motDePasse,
        };

        try {
            const response = await axios.post(url, Login1);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('role', credentials.role);
            
            // Redirection selon le rôle
            if (credentials.role === 'enseignant') {
                navigate('/dashboard-enseignant');
            } else {
                navigate('/dashboard-etudiant');
            }
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Connexion
                </h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Rôle
                            </label>
                            <select
                                value={credentials.role}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    role: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="etudiant">Étudiant</option>
                                <option value="enseignant">Enseignant</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    email: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={credentials.motDePasse}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    motDePasse: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
