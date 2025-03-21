import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

const ExamList = () => {
    const [examens, setExamens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExamens = async () => {
            try {
                const response = await axios.get('/api/examens');
                setExamens(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des examens:', error);
                setLoading(false);
            }
        };

        fetchExamens();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Liste des Examens</h2>
            {loading ? (
                <div>Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {examens.map((examen) => (
                        <div key={examen.idExamen} className="border rounded-lg p-4 shadow-md">
                            <h3 className="text-xl font-semibold">{examen.titre}</h3>
                            <p className="text-gray-600">Date limite: {new Date(examen.dateLimite).toLocaleDateString()}</p>
                            <p className="text-gray-600">Matière: {examen.idMatiere}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExamList; 