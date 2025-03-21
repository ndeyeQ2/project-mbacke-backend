const Matiere = require('../models/Matiere');

// Créer une nouvelle matière
exports.createMatiere = async (req, res) => {
    try {
        const { nom } = req.body;
        const newMatiere = await Matiere.create({ nom });
        res.status(201).json(newMatiere);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir toutes les matières
exports.getAllMatieres = async (req, res) => {
    try {
        const matieres = await Matiere.findAll();
        res.status(200).json(matieres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtenir une matière par ID
exports.getMatiereById = async (req, res) => {
    try {
        const { id } = req.params;
        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ error: 'Matière non trouvée' });
        }
        res.status(200).json(matiere);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une matière
exports.updateMatiere = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom } = req.body;

        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ error: 'Matière non trouvée' });
        }

        matiere.nom = nom;
        await matiere.save();
        res.status(200).json(matiere);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une matière
exports.deleteMatiere = async (req, res) => {
    try {
        const { id } = req.params;
        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ error: 'Matière non trouvée' });
        }

        await matiere.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
