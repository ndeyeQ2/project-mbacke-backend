const Classe = require('../models/Classe'); // Importation du modèle Classe

// Créer une nouvelle classe
exports.createClasse = async (req, res) => {
    const { nomClasse } = req.body;

    try {
        const classe = await Classe.create({
            nomClasse,
        });
        res.status(201).json({ message: 'Classe créée avec succès.', classe });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la création de la classe.', error: err });
    }
};

// Obtenir toutes les classes
exports.getClasses = async (req, res) => {
    try {
        const classes = await Classe.findAll();
        res.status(200).json(classes);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des classes.', error: err });
    }
};

// Obtenir une classe par son ID
exports.getClasseById = async (req, res) => {
    const { idClasse } = req.params;

    try {
        const classe = await Classe.findOne({
            where: { idClasse }
        });

        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvée.' });
        }

        res.status(200).json(classe);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération de la classe.', error: err });
    }
};

// Mettre à jour une classe
exports.updateClasse = async (req, res) => {
    const { idClasse } = req.params; // Extraire l'identifiant de la classe depuis les paramètres de l'URL
    const { nomClasse } = req.body; // Extraire le nouveau nom de la classe depuis le corps de la requête

    try {
        // Vérifier que le corps de la requête contient le champ 'nomClasse'
        if (!nomClasse) {
            return res.status(400).json({ message: 'Le champ "nomClasse" est requis.' });
        }

        // Rechercher la classe par son ID
        const classe = await Classe.findOne({ where: { idClasse } });

        // Vérifier si la classe existe
        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvée.' });
        }

        // Mettre à jour le nom de la classe
        classe.nomClasse = nomClasse;

        // Enregistrer les modifications dans la base de données
        await classe.save();

        // Retourner une réponse réussie avec les informations de la classe mise à jour
        res.status(200).json({
            message: 'Classe mise à jour avec succès.',
            classe
        });
    } catch (err) {
        // Gérer les erreurs et retourner une réponse d'erreur
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la classe.',
            error: err.message
        });
    }
};


// Supprimer une classe
exports.deleteClasse = async (req, res) => {
    const { idClasse } = req.params;

    try {
        const classe = await Classe.findOne({
            where: { idClasse }
        });

        if (!classe) {
            return res.status(404).json({ message: 'Classe non trouvée.' });
        }

        await classe.destroy();

        res.status(200).json({ message: 'Classe supprimée avec succès.' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la classe.', error: err });
    }
};
