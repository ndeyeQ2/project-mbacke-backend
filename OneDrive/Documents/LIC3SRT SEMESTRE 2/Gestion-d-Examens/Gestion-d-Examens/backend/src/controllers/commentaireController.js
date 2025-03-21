const Comment = require('../models/Commentaire');

// Créer un commentaire
const createComment = async (req, res) => {
    try {
        const { contenu, idEtudiant, idEnseignant, idExamen } = req.body;

        // Vérifier qu'un seul des deux (idEtudiant ou idEnseignant) est fourni
        if ((idEtudiant && idEnseignant) || (!idEtudiant && !idEnseignant)) {
            return res.status(400).json({ message: 'Un commentaire doit être associé soit à un étudiant, soit à un enseignant, mais pas aux deux.' });
        }

        const newComment = await Comment.create({
            contenu,
            idEtudiant,
            idEnseignant,
            idExamen,
            dateModification: new Date() // Date de création = date actuelle
        });

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Erreur lors de la création du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
    }
};

// Récupérer tous les commentaires
const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.findAll();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
    }
};

// Récupérer un commentaire par son ID
const getCommentById = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé.' });
        }

        res.status(200).json(comment);
    } catch (error) {
        console.error('Erreur lors de la récupération du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du commentaire', error });
    }
};

// Mettre à jour un commentaire
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenu, idEtudiant, idEnseignant, idExamen } = req.body;

        // Vérifier qu'un seul des deux (idEtudiant ou idEnseignant) est fourni
        if ((idEtudiant && idEnseignant) || (!idEtudiant && !idEnseignant)) {
            return res.status(400).json({ message: 'Un commentaire doit être associé soit à un étudiant, soit à un enseignant, mais pas aux deux.' });
        }

        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé.' });
        }

        // Mettre à jour les champs
        comment.contenu = contenu;
        comment.idEtudiant = idEtudiant;
        comment.idEnseignant = idEnseignant;
        comment.idExamen = idExamen;
        comment.dateModification = new Date(); // Mettre à jour la date de modification

        await comment.save();

        res.status(200).json(comment);
    } catch (error) {
        console.error('Erreur lors de la mise à jour du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire', error });
    }
};

// Supprimer un commentaire
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ message: 'Commentaire non trouvé.' });
        }

        await comment.destroy();

        res.status(204).json({ message: 'Commentaire supprimé avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error });
    }
};

// Exporter les fonctions du contrôleur
module.exports = {
    createComment,
    getAllComments,
    getCommentById,
    updateComment,
    deleteComment
};