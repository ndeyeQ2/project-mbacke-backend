import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

const Register = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        motDePasse: '',
        confirmMotDePasse: '',
        role: 'etudiant',
        idClasse: '', // Pour les étudiants
        idMatiere: '', // Pour les enseignants
        idEtudiant: '', // Nouveau champ pour les étudiants
        idEnseignant: '' // Nouveau champ pour les enseignants
    });
    const [error, setError] = useState('');
    const [classes, setClasses] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const navigate = useNavigate();

    // Charger les classes et matières au chargement du composant
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [classesRes, matieresRes] = await Promise.all([
                    axios.get('/api/classe/get'),
                    axios.get('/api/matiere/get')
                ]);
                setClasses(classesRes.data);
                setMatieres(matieresRes.data);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.motDePasse !== formData.confirmMotDePasse) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            const endpoint = formData.role === 'etudiant' 
                ? '/api/etudiants/register' 
                : '/api/enseignants/register';

            const dataToSend = {
                nom: formData.nom,
                prenom: formData.prenom,
                email: formData.email,
                motDePasse: formData.motDePasse,
                ...(formData.role === 'etudiant' 
                    ? { 
                        idClasse: formData.idClasse,
                        idEtudiant: formData.idEtudiant 
                    }
                    : { 
                        idMatiere: formData.idMatiere,
                        idEnseignant: formData.idEnseignant 
                    }
                )
            };

            await axios.post(endpoint, dataToSend);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Inscription
                    </h2>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {error}
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Rôle
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="etudiant">Étudiant</option>
                                <option value="enseignant">Enseignant</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                required
                                value={formData.nom}
                                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input
                                type="text"
                                required
                                value={formData.prenom}
                                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        {formData.role === 'etudiant' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ID Étudiant</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.idEtudiant}
                                        onChange={(e) => setFormData({...formData, idEtudiant: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Ex: ETU001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Classe</label>
                                    <select
                                        required
                                        value={formData.idClasse}
                                        onChange={(e) => setFormData({...formData, idClasse: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionnez une classe</option>
                                        {classes.map(classe => (
                                            <option key={classe.idClasse} value={classe.idClasse}>
                                                {classe.nomClasse}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ID Enseignant</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.idEnseignant}
                                        onChange={(e) => setFormData({...formData, idEnseignant: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Ex: ENS001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Matière</label>
                                    <select
                                        required
                                        value={formData.idMatiere}
                                        onChange={(e) => setFormData({...formData, idMatiere: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Sélectionnez une matière</option>
                                        {matieres.map(matiere => (
                                            <option key={matiere.idMatiere} value={matiere.idMatiere}>
                                                {matiere.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                            <input
                                type="password"
                                required
                                value={formData.motDePasse}
                                onChange={(e) => setFormData({...formData, motDePasse: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
                            <input
                                type="password"
                                required
                                value={formData.confirmMotDePasse}
                                onChange={(e) => setFormData({...formData, confirmMotDePasse: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            S'inscrire
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register; 