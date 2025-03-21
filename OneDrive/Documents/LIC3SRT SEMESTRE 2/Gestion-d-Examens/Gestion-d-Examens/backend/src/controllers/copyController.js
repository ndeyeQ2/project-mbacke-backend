const Copy = require('../models/Copy');
const deepSeekCorrectionOllama = require('../services/aiCorrectionService');  // Importer ton service DeepSeek
const Exam = require('../models/Exam');  // Importer le modèle Exam
const {calculateExamStatistic} = require("./statistiqueController");
const pdf = require('pdf-parse');


// Soumettre une copie
exports.submitCopy = async (req, res) => {
    const { idExamen } = req.body;
    const idEtudiant = req.user.id;

    console.log('Création d\'une nouvelle copie pour l\'étudiant :', idEtudiant);

    if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier soumis.' });
    }

    const fichier = req.file.path;

    console.log('Chemin du fichier soumis :', fichier);

    const fs = require('fs');
    try {
        const fileData = fs.readFileSync(fichier);
        const pdfText = await pdf(fileData);
        console.log('Contenu du fichier soumis :', pdfText.text);
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier soumis :', error.message);
        return res.status(500).json({ message: 'Impossible de lire le fichier soumis.' });
    }

    try {
        // Récupérer l'examen associé
        const exam = await Exam.findByPk(idExamen);
        if (!exam) {
            return res.status(404).json({ message: 'Examen non trouvé.' });
        }


        // Récupérer le type d'examen
        const typeExamen = exam.typeExamen;
        const texteExamen = exam.sujet;

        console.log("texte de l'examen :" , texteExamen);

        if (!typeExamen) {
            throw new Error('Type d\'examen non spécifié pour cet examen.');
        }

        // Créer une nouvelle copie dans la base de données
        const copy = await Copy.create({
            idExamen,
            idEtudiant,
            fichier,
            dateDeSoumission: new Date(),
        });


        // Appeler DeepSeek via Ollama pour la correction en spécifiant le type d'examen
        const correctionData = await deepSeekCorrectionOllama(texteExamen, fichier, typeExamen);

        if (!correctionData || !correctionData.note || !correctionData.commentaires) {
            throw new Error('Erreur lors de la génération des commentaires ou de la note.');
        }

        console.log('Résultats de la correction automatique :', correctionData);

        // Mettre à jour la copie avec la note et les commentaires
        copy.note = correctionData.note;
        //copy.note = 17;

         // Passer la requête et la réponse pour la logique de calcul
        copy.commentaires = correctionData.commentaires;
        await copy.save();
        console.log("Lou xew fi ?" , idExamen);
        await calculateExamStatistic({
            body:{
                idExamen : idExamen,
            }
        });

        // Créer une nouvelle note pour l'historique

        /* const newNote = await Note.create({
            idCopie: copy.id,
            note: copy.note,
            source: 'DeepSeek via Ollama',
        }); */


        console.log('Note sauvegardée avec succès pour la copie ID :', copy.id);

        // Retourner la réponse
        res.status(201).json({
            copy,
            note: copy.note,
            message: 'Copie soumise et corrigée automatiquement via DeepSeek.',
        });
    } catch (err) {
        console.error('Erreur lors de la soumission de la copie:', err.message);
        res.status(500).json({
            message: 'Erreur lors de la soumission de la copie.',
            error: err.message,
        });
    }
};



// Obtenir toutes les copies d'un examen
exports.getCopiesByExam = async (req, res) => {
    const idExamen = req.params.id;

    try {
        // Trouver toutes les copies liées à un examen
        const copies = await Copy.findAll({ where: { idExamen } });
        if (!copies || copies.length === 0) {
            return res.status(404).json({ message: 'Aucune copie trouvée pour cet examen.' });
        }
        res.status(200).json(copies);
    } catch (err) {
        console.error('Erreur lors de la récupération des copies:', err.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des copies', error: err.message });
    }
};


// Supprimer une copie
exports.deleteCopy = async (req, res) => {
    try {
        const copy = await Copy.findByPk(req.params.id); // Trouver la copie par son ID
        if (!copy) {
            return res.status(404).json({ message: 'Copie non trouvée.' });
        }

        // Supprimer l'enregistrement
        await copy.destroy();
        // await calculateExamStatistic(idExamen);

        res.status(200).json({ message: 'Copie supprimée avec succès.' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la copie:', err.message);
        res.status(500).json({ message: 'Erreur lors de la suppression de la copie', error: err.message });
    }
};
