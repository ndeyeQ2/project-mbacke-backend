const sequelize = require('../config/sequelize');
// const Comment = require('../models/Commentaire');

exports.getCommentByIdExam = async (req, res) => {
    const idExam = req.params.id;
    if (!idExam) {
        return res.status(404).json({ message: 'Examen non trouve'});
    }

    try {
        const examComments = await sequelize.query(
            `
            SELECT 
                C.contenu, 
                C.dateModification, 
                Et.prenom, 
                Et.nom
            FROM 
                COMMENTAIRE C
            JOIN 
                ETUDIANT Et ON C.idEtudiant = Et.idEtudiant
            WHERE C.idExamen = ?
            UNION
            SELECT 
                C.contenu,
                C.dateModification, 
                En.prenom, 
                En.nom
            FROM 
                COMMENTAIRE C
            JOIN ENSEIGNANT En  ON C.idEnseignant = En.idEnseignant 
            WHERE C.idExamen = ?
            `,
            {
                replacements: [idExam, idExam],
                type: sequelize.QueryTypes.SELECT
            }
        );
        if (examComments.length === 0) {
            return res.status(404).json({ message: 'Aucun commentaire trouvé pour cet examen.' });
        }

        return res.status(200).json(examComments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error: error });
    }
}