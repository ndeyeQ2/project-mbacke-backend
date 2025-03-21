const Statistique= require('../models/Statistique');
const Examen = require('../models/Exam');
const Copie = require('../models/Copy');

// Créer des statistiques pour un examen
exports.calculateExamStatistic = async (req,res) => {
    try {
        const idExamen = req.body.idExamen || req.params.idExamen;  // Utiliser req.params ou req.body selon le cas.

        console.log("id de l'examen" ,idExamen);

        if (!idExamen) {
            return res.status(400).json({ message: 'ID de l\'examen requis.' });
        }

        const examen = await Examen.findOne({ where: { idExamen } });

        if (!examen) {
            return res.status(404).json({ message: 'Examen non trouvé.' });
        }
        // Récupérer toutes les copies de l'examen
        const copies = await Copie.findAll({ where: { idExamen } });

        if (copies.length === 0) {
            return res.status(400).json({ message: 'Aucune copie trouvée pour cet examen.' });
        }

        let totalNotes = 0.0;

        copies.forEach(copie => totalNotes = totalNotes + + copie.note);
        // Calculer la moyenne et le taux de réussite
        //const totalNotes = copies.reduce((sum, copie) => sum + copie.note, 0);
        console.log('copies: ', copies);
        console.log('totalNotes: ', totalNotes);
        const moyenne = totalNotes / copies.length;
        console.log('moyenne: ', moyenne);

        const nbReussites = copies.filter(copie => copie.note >= 10).length;
        const tauxReussite = (nbReussites / copies.length) * 100;

        // Créer les statistiques

        let newStatistique = null;
        const oldStatistique = await Statistique.findOne({ where: { idExamen } });
        console.log('old stats: ', oldStatistique);
        if (oldStatistique) {
            await Statistique.update({
                    moyenne,
                    tauxReussite
                },
                { where: { idExamen } });
            newStatistique = await Statistique.findOne({ where: { idExamen } });;
        }
        else{
            newStatistique = new Statistique({
                moyenne,
                tauxReussite,
                idExamen
            });
            await newStatistique.save();
        }
        console.log('new stats: ',newStatistique);
        // res.status(201).json(newStatistique);
    } catch (error) {
        console.error('Erreur lors de la création des statistiques :', error);
        res.status(500).json({ message: 'Erreur lors de la création des statistiques', error });
    }
};

// Récupérer toutes les statistiques
exports.getAllStatistiques = async (req, res) => {
    try {
        const statistiques = await Statistique.findAll({
            include: [{ model: Examen, as: 'exam', attributes: ['titre'] }] // Inclure les informations de l'examen
        });
        console.log(Statistique);

        res.status(200).json(statistiques);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
    }
};

// Récupérer les statistiques d'un examen par son ID
exports.getStatistiqueByExamenId = async (req, res) => {

    try {
        const { idExamen } = req.params;

        const statistique = await Statistique.findOne({
            where: { idExamen },
            include: [{ model: Examen, as: 'exam', attributes: ['titre'] }] // Inclure les informations de l'examen
        });

        if (!statistique) {
            return res.status(404).json({ message: 'Statistiques non trouvées pour cet examen.' });
        }

        res.status(200).json(statistique);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques', error });
    }
};
