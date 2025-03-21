const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');

const login = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        // Vérifier si l'utilisateur est un étudiant
        let user = await Etudiant.findOne({ where: { email } });
        let role = 'etudiant';

        // Si ce n'est pas un étudiant, vérifier si c'est un enseignant
        if (!user) {
            user = await Enseignant.findOne({ where: { email } });
            role = 'enseignant';
        }

        // Si aucun utilisateur n'est trouvé
        if (!user) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user.idEtudiant || user.idEnseignant, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Retourner le token et le rôle
        res.json({ token, userId: user.idEtudiant || user.idEnseignant, role });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: err });
    }
};

module.exports = { login };