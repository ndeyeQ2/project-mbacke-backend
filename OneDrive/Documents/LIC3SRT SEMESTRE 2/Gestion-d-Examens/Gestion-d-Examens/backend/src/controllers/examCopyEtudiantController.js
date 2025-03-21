const sequelize = require('../config/sequelize');
const Examen = require('../models/Exam');


exports.getCopiesEtudiantByExam = async (req, res) => {
    const idExamen = req.params.id;
    console.log('Récupération des copies pour l\'examen :', idExamen);

    try {
        const exam = await Examen.findOne({where : { idExamen }});
        if (!exam) {
            return res.status(404).json({ message: 'Examen non trouvé.' });
        }

        const examCopiesEtudiant = await sequelize.query(
            `SELECT 
                    Et.idEtudiant,
                    Et.prenom,
                    Et.nom,
                    C.note,
                    C.fichier,
                    C.dateDeSoumission
                FROM ETUDIANT Et 
                JOIN COPIE C ON C.idEtudiant = Et.idEtudiant 
                JOIN EXAMEN Ex ON Ex.idExamen = C.idExamen 
                WHERE Ex.idExamen = ?
                ORDER BY C.dateDeSoumission DESC`,
            {
                replacements: [idExamen],
                type: sequelize.QueryTypes.SELECT
            }
        );
        console.log(examCopiesEtudiant);
        const nombreCopies = await sequelize.query(
            `SELECT COUNT(*) AS nombreCopies FROM COPIE WHERE idExamen = ?`,
            {
                replacements: [idExamen],
                type: sequelize.QueryTypes.SELECT
            }
        );
        const examCopiesEtudiantNumber = {
            examCopiesEtudiant,
            nombreCopies : nombreCopies[0].nombreCopies,
        };
        console.log(nombreCopies);
        res.json(examCopiesEtudiantNumber);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des copies.', error: err });
    }
}
