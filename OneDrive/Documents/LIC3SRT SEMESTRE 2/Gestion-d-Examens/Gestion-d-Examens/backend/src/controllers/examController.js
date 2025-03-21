const Exam = require('../models/Exam');
const Enseignant = require('../models/Enseignant'); // Assurez-vous d'importer le modèle d'enseignant
const upload = require('../config/multer'); // Importation de la configuration multer
const Copy = require("../models/Copy"); // Importation de la configuration des copies
const pdf = require('pdf-parse');
const {createNotificationForAll} = require("./notificationController");

// Créer un examen
exports.createExam = async (req, res) => {
    const { titre, dateLimite, idMatiere, typeExamen } = req.body; // Ajout de typeExamen
    const idEnseignant = req.user.idEnseignant;

    // Vérifier que les champs obligatoires sont fournis
    if (!titre || !dateLimite || !idMatiere || !typeExamen) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Vérifier si l'enseignant existe
        const professor = await Enseignant.findOne({ where: { idEnseignant } });
        if (!professor) {
            return res.status(404).json({ message: 'Enseignant non trouvé.' });
        }

        // Récupérer le nom complet du professeur
        const professorName = `${professor.prenom} ${professor.nom}`;

        // Vérifiez si un fichier a été téléchargé pour le sujet
        const sujetPath = req.file ? req.file.path : null;

        // Création de l'examen en stockant idEnseignant, idMatiere, et typeExamen dans la base
        const exam = await Exam.create({
            titre,
            dateDeCreation: new Date(),
            dateLimite,
            sujet: sujetPath,
            idEnseignant,
            idMatiere,
            typeExamen, // Stocke le type de l'examen
        });

        // Logs et notifications
        console.log(`Examen "${exam.titre}" à rendre le "${exam.dateLimite}" a été créé par le professeur "${professorName}".`);

        const notificationMessage = `Un nouvel examen "${exam.titre}" a été créé par ${professorName}.`;

        // Exemple de notification (adapter en fonction de votre système)
        await createNotificationForAll({
            body: {
                examen: { idExamen: exam.idExamen }, // Fournir idExamen explicitement
                message: notificationMessage,
            },
        });

        // Notifier tous les clients connectés via Socket.IO
        if (req.io) {
            req.io.emit('NEW_EXAM', {
                message: notificationMessage,
            });
        }

        res.status(201).json(exam);
    } catch (err) {
        console.error('Erreur lors de la création de l\'examen :', err.message);
        res.status(500).json({ message: "Erreur lors de la création de l'examen", error: err.message });
    }
};

// Obtenir tous les examens d'un enseignant
exports.getExamsByTeacher = async (req, res) => {
    try {
        const teacherId = req.user.idEnseignant; // ID récupéré depuis le JWT

        if (!teacherId) {
            return res.status(401).json({ message: 'Utilisateur non autorisé ou identifiant manquant.' });
        }

        // Récupérer les examens de cet enseignant
        const exams = await Exam.findAll({
            where: { idEnseignant: teacherId },
        });

        if (exams.length === 0) {
            return res.status(404).json({ message: 'Aucun examen trouvé pour cet enseignant.' });
        }

        res.status(200).json(exams);
    } catch (err) {
        console.error('Erreur lors de la récupération des examens:', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des examens.', error: err.message });
    }
};

// Supprimer un examen
exports.deleteExam = async (req, res) => {
    const idExamen = req.params.id; // Récupérer l'ID d'examen depuis les paramètres d'URL

    if (!idExamen || isNaN(idExamen)) {
        return res.status(400).json({ message: "ID d'examen invalide." });
    }

    try {
        // Chercher l'examen à supprimer
        const exam = await Exam.findOne({ where: { idExamen } });

        if (!exam) {
            return res.status(404).json({ message: "Examen non trouvé." });
        }

        // Supprimer l'examen
        await exam.destroy();

        console.log("ID de l'examen supprimé:", idExamen);
        res.status(200).json({ message: "Examen supprimé avec succès." });
    } catch (err) {
        console.error('Erreur lors de la suppression de l\'examen :', err.message);
        res.status(500).json({ message: "Erreur lors de la suppression de l'examen.", error: err.message });
    }
};
