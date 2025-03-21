const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Récupérer le token de l'en-tête Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Vérifier si le token est présent
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé : aucun token fourni.' });
    }

    try {
        // Valider le token avec la clé secrète
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Log pour vérifier les informations contenues dans le token (uniquement en développement)
        if (process.env.NODE_ENV !== 'production') {
            console.log(decoded); // Vérifier ici si `idEnseignant` est bien présent
        }

        // Ajouter les informations de l'utilisateur à l'objet `req`
        req.user = decoded;

        // Passer au middleware ou à la route suivante
        next();
    } catch (err) {
        // Gérer les erreurs spécifiques
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Accès refusé : token expiré.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Accès refusé : token invalide.' });
        } else {
            console.error('Erreur de validation du token :', err);
            return res.status(401).json({ message: 'Accès refusé : erreur de validation du token.' });
        }
    }
};

module.exports = auth;
