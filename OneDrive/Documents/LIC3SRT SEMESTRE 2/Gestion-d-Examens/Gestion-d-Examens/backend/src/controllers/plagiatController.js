const Plagiat = require('../models/Plagiat');

// Détecter le plagiat
exports.detectPlagiat = async (req, res) => {
    const { copieId, tauxSimilarite } = req.body;

    try {
        const plagiat = new Plagiat({
            copieId,
            tauxSimilarite,
        });

        await plagiat.save();
        res.status(201).json(plagiat);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la détection du plagiat', error: err });
    }
};

// Obtenir tous les cas de plagiat pour une copie
exports.getPlagiatByCopy = async (req, res) => {
    const copieId = req.params.id;

    try {
        const plagiat = await Plagiat.find({ copieId });
        res.status(200).json(plagiat);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des cas de plagiat', error: err });
    }
};