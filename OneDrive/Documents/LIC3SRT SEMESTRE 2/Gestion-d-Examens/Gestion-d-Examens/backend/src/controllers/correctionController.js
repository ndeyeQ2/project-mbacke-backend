const Correction = require('../models/Correction');
const axios = require('axios');



const corrigerExamen = async (texteExamen) => {
    try {
        const response = await axios.post('http://127.0.0.1:11434/v1/completions', {
            model: 'deepseek-r1:8b',  // Modèle DeepSeek
            messages: [
                { role: 'user', content: texteExamen }
            ]
        });

        // Retourne la correction automatique
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erreur dans la correction automatique :', error);
        throw new Error('Erreur lors de la correction automatique');
    }
};

// Corriger une copie
exports.correctCopy = async (req, res) => {
    const { copieId, noteIa, noteProf } = req.body;

    try {
        const correction = new Correction({
            copieId,
            noteIa,
            noteProf,
            noteFinal: noteProf || noteIa, // Utiliser la note du prof si elle existe, sinon la note de l'IA
        });

        await correction.save();
        res.status(201).json(correction);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la correction de la copie', error: err });
    }
};

// Obtenir toutes les corrections pour une copie
exports.getCorrectionsByCopy = async (req, res) => {
    const copieId = req.params.id;

    try {
        const corrections = await Correction.find({ copieId });
        res.status(200).json(corrections);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des corrections', error: err });
    }
};