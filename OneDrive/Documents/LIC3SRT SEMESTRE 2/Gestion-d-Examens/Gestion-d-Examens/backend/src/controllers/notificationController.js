const Notification = require('../models/Notification');
const Etudiant = require('../models/Etudiant');
const Examen =  require('../models/Exam');

// Créer une notification pour un étudiant spécifique
exports.createNotification = async (req, res) => {
    const { examen , message } = req.body;

    // Vérifier que tous les champs sont fournis
    if ( !examen.idExamen  || !message) {
        return res.status(400).json({ message: 'Tous les champs sont requis : idEtudiant, idExamen, message.' });
    }

    try {
        // Vérifier que l'étudiant existe
        const etudiant = await Etudiant.findByPk(idEtudiant);
        if (!etudiant) {
            return res.status(404).json({ message: 'Étudiant non trouvé.' });
        }

        // Vérifier que l'examen existe
        const examen = await Examen.findByPk(idExamen);
        if (!examen) {
            return res.status(404).json({ message: 'Examen non trouvé.' });
        }

        // Créer la notification
        const notification = await Notification.create({
            message,
            date: new Date(),
            idEtudiant,
            idExamen,
        });

        // Répondre avec la notification créée
        res.status(201).json(notification);
    } catch (err) {
        console.error('Erreur lors de la création de la notification :', err);
        res.status(500).json({ message: 'Erreur lors de la création de la notification', error: err.message });
    }
};

// Créer une notification pour tous les étudiants
exports.createNotificationForAll = async (req, res) => {
    const { message, examen } = req.body;

    if (!message || !examen || !examen.idExamen) {
        return res.status(400).json({ message: 'Tous les champs sont requis : message, examen (avec idExamen).' });
    }

    try {
        // Récupérer tous les étudiants
        const etudiants = await Etudiant.findAll();
        if (!etudiants || etudiants.length === 0) {
            return res.status(404).json({ message: 'Aucun étudiant trouvé.' });
        }

        // Créer une notification pour chaque étudiant
        const notifications = await Promise.all(
            etudiants.map(async (etudiant) => {
                return await Notification.create({
                    message,
                    dateEtHeure: new Date(),
                    idEtudiant: etudiant.idEtudiant,
                    idExam: examen.idExamen, // Ajout explicite de idExam
                });
            })
        );

       // res.status(201).json(notifications);
    } catch (err) {
        console.error('Erreur lors de la création des notifications :', err);
        res.status(500).json({ message: 'Erreur lors de la création des notifications', error: err.message });
    }
};


// Obtenir toutes les notifications d'un utilisateur
exports.getNotificationsByUser = async (req, res) => {
    const idEtudiant = req.params.id;

    try {
        const notifications = await Notification.find({ idEtudiant });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error: err });
    }
};

exports.delete = async (req, res) => {
    const idNotif = req.params.id;
    try {
        const notification = await Notification.findByIdAndDelete({ idNotif });
        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée.' });
        }
        res.status(200).json({ message: 'Notification supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la notification', error: err });
    }
}
exports.deleteAll= async (req, res) => {
    const idEtudiant = req.params.id;
    if (!idEtudiant) {
        return res.status(404).json({ message: 'Etudiant non trouvé' });
    }
    try {
        await Notification.destroy({ where: { idEtudiant } });
        res.status(200).json({ message: 'Notifications supprimées avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression des notifications', error: err });
    }
}