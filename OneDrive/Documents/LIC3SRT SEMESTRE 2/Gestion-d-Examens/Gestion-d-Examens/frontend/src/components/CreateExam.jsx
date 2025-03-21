import React, { useState } from 'react';
import axios from '../utils/axiosConfig';

const CreateExam = () => {
    const [examData, setExamData] = useState({
        titre: '',
        dateLimite: '',
        idMatiere: '',
        typeExamen: '',
        sujet: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        Object.keys(examData).forEach(key => {
            formData.append(key, examData[key]);
        });

        try {
            await axios.post('/api/examens', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Examen créé avec succès!');
        } catch (error) {
            console.error('Erreur lors de la création de l\'examen:', error);
            alert('Erreur lors de la création de l\'examen');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Créer un nouvel examen</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Titre</label>
                    <input
                        type="text"
                        value={examData.titre}
                        onChange={(e) => setExamData({...examData, titre: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Date limite</label>
                    <input
                        type="datetime-local"
                        value={examData.dateLimite}
                        onChange={(e) => setExamData({...examData, dateLimite: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Sujet (PDF)</label>
                    <input
                        type="file"
                        onChange={(e) => setExamData({...examData, sujet: e.target.files[0]})}
                        className="w-full p-2 border rounded"
                        accept=".pdf"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Créer l'examen
                </button>
            </form>
        </div>
    );
};

export default CreateExam; 