const axios = require('axios');
const pdfParse = require('pdf-parse'); // Bibliothèque pour lire les PDF
const fs = require('fs'); // Pour lire les fichiers locaux
const prompts = require('./prompts.json'); // Charger les prompts depuis le fichier JSON

// Fonction pour extraire le contenu du fichier PDF
const extraireTexteDuPDF = async (cheminFichier) => {
  try {
    const dataBuffer = fs.readFileSync(cheminFichier); // Lire le fichier
    const pdfData = await pdfParse(dataBuffer); // Extraire les données PDF
    return pdfData.text; // Retourner le texte extrait
  } catch (error) {
    console.error("Erreur lors de l'extraction du texte du PDF:", error.message);
    throw new Error("Impossible d'extraire le texte du PDF.");
  }
};

// Fonction pour envoyer les textes de l'examen et de la copie à Ollama (via DeepSeek) et obtenir la correction
const corrigerCopie = async (cheminExamen, cheminCopie, typeCorrection) => {
  try {
    // Vérifier que le type de correction existe dans le fichier JSON
    const selectedPrompt = prompts[typeCorrection];
    if (!selectedPrompt) {
      throw new Error(`Type de correction non trouvé : ${typeCorrection}`);
    }

    // Extraire le texte des fichiers PDF
    const texteExamen = await extraireTexteDuPDF(cheminExamen);
    const texteCopie = await extraireTexteDuPDF(cheminCopie);

    // Vérifier si les textes de l'examen et de la copie sont valides
    if (!texteExamen || texteExamen.trim() === "") {
      throw new Error("Le texte de l'examen est vide ou non valide.");
    }

    if (!texteCopie || texteCopie.trim() === "") {
      throw new Error("Le texte de la copie est vide ou non valide.");
    }

    // Remplacer les variables dans le prompt avec le texte de l'examen et de la copie
    let prompt = selectedPrompt.replace('{texteExamen}', texteExamen).replace('{texteCopie}', texteCopie);

    // Afficher le prompt qui sera envoyé
    console.log('Prompt envoyé à l\'API DeepSeek pour correction de la copie :', prompt);

    // Configurer la requête vers l'API
    const response = await axios.post(
        'http://localhost:11434/api/generate',
        {
          model: 'deepseek-r1:7b', // Modèle utilisé pour la correction
          messages: [
            { role: 'system', content: 'Voici l\'examen et la copie à corriger.' }, // Message explicatif pour l'IA
            { role: 'user', content: prompt }, // Prompt envoyé à l'IA
            { role: 'user', content: `Texte de l'examen :\n${texteExamen}` }, // Texte de l'examen
            { role: 'user', content: `Texte de la copie :\n${texteCopie}` } // Texte de la copie
          ]
        },
        { timeout: 60000 } // Timeout de 60 secondes
    );


    console.log('Réponse de test de l\'API DeepSeek :', response.data);

    // Vérifier si la réponse contient le champ attendu
    if (!response.data || !response.data.response) {
      throw new Error('Aucune réponse générée ou réponse mal formatée par l\'API DeepSeek');
    }

    // Retourner la correction générée par l'API
    return response.data.response;

  } catch (error) {
    console.error('Erreur lors de la correction de la copie d\'examen :', error.message);
    throw new Error(`Erreur lors de la correction de la copie : ${error.message}`);
  }
};

module.exports = corrigerCopie;
