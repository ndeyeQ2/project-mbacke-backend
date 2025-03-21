const axios = require('axios');
const stringSimilarity = require('string-similarity'); // Si tu choisis de développer ton propre algorithme de comparaison de texte

class PlagiarismService {
  // Méthode pour vérifier si un texte est plagié via Turnitin
  async checkPlagiarismWithTurnitin(text) {
    const apiUrl = 'https://api.turnitin.com/v1/plagiarism-check';
    const apiKey = 'YOUR_API_KEY';  // Remplace par ta vraie clé API de Turnitin

    try {
      const response = await axios.post(apiUrl, {
        text: text
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      return response.data; // Traite les données retournées par Turnitin
    } catch (error) {
      console.error('Erreur lors de la vérification de plagiat avec Turnitin:', error);
      throw new Error('Échec de la détection de plagiat avec Turnitin');
    }
  }

  // Méthode pour comparer les textes localement via string-similarity
  compareTexts(text1, text2) {
    const similarity = stringSimilarity.compareTwoStrings(text1, text2);
    return similarity;  // Retourne une valeur entre 0 et 1 (0 = pas similaire, 1 = exactement similaire)
  }

  // Méthode pour vérifier le plagiat en utilisant DeepSeek via Ollama
  async checkPlagiarismWithDeepSeek(text) {
    const apiUrl = 'http://localhost:3000/ollama/DeepSeek';  // Exemple d'URL pour Ollama localement

    try {
      const response = await axios.post(apiUrl, { text: text });
      return response.data; // Résultats de l'analyse par DeepSeek
    } catch (error) {
      console.error('Erreur lors de la vérification avec DeepSeek:', error);
      throw new Error('Échec de la détection de plagiat avec DeepSeek');
    }
  }
}

module.exports = new PlagiarismService();