const { Op } = require('sequelize');
require('dotenv').config();  // Charger les variables d'environnement
const Enseignant = require('../models/Enseignant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Inscription d'un nouvel enseignant

exports.register = async (req, res) => {
    const { email, motDePasse, nom, prenom, idEnseignant, idMatiere } = req.body;

    if (!email || !motDePasse || !nom || !prenom || !idEnseignant || !idMatiere) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    try {
        // Vérification si l'email existe déjà
        const existingEnseignant = await Enseignant.findOne({ where: { email } });
        if (existingEnseignant) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hachage du mot de passe avant de l'enregistrer
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        // Création de l'enseignant dans la base de données
        const enseignant = await Enseignant.create({
            email,
            motDePasse: hashedPassword,
            nom,
            prenom,
            idEnseignant,
            idMatiere
        });

        res.status(201).json({ message: 'Enseignant créé avec succès.', enseignant });
    } catch (err) {
        console.error('Erreur lors de la création de l\'enseignant :', err);
        res.status(500).json({
            message: 'Erreur lors de la création de l\'enseignant.',
            error: err.message,
        });
    }
};

// Connexion d'un enseignant
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
    }

    try {
        // Recherche de l'enseignant dans la base de données
        const enseignant = await Enseignant.findOne({ where: { email } });
        if (!enseignant) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }

        // Vérifier que le mot de passe stocké existe dans la base de données
        if (!enseignant.motDePasse) {
            return res.status(500).json({ message: 'Erreur interne : Mot de passe manquant dans la base de données.' });
        }

        // Comparer le mot de passe en clair avec le mot de passe haché
        const isPasswordValid = await bcrypt.compare(password, enseignant.motDePasse);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
        }
       // Si le mot de passe est valide, générer un token JWT
        const token = jwt.sign(
            { idEnseignant: enseignant.idEnseignant, role: 'enseignant' },  // Assurez-vous que `idEnseignant` est bien dans le payload
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Réponse avec le token JWT
        res.status(200).json({
            message: 'Connexion réussie.',
            token, // Le token JWT pour l'authentification
            userId: enseignant.idEnseignant, // ID de l'enseignant
            role: 'enseignant', // Rôle de l'utilisateur
        });
    } catch (err) {
        console.error('Erreur lors de la connexion :', err);
        res.status(500).json({
            message: 'Erreur lors de la connexion.',
            error: err.message,
        });
    }
};



// Obtenir les informations d'un enseignant
exports.getEnseignant = async (req, res) => {
    try {
        const enseignant = await Enseignant.findByPk(req.params.id, {
            attributes: { exclude: ['motDePasse'] }
        });

        if (!enseignant) {
            return res.status(404).json({ message: 'Enseignant non trouvé.' });
        }

        res.status(200).json(enseignant);
    } catch (err) {
        console.error('Erreur lors de la récupération de l\'enseignant :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'enseignant.', error: err.message });
    }
};

// Mise à jour des informations d'un enseignant
exports.updateEnseignant = async (req, res) => {
    const { id } = req.params; // ID de l'enseignant à mettre à jour
    const { nom, prenom, email, motDePasse } = req.body; // Champs à mettre à jour

    try {
        const enseignant = await Enseignant.findByPk(id);

        if (!enseignant) {
            return res.status(404).json({ message: 'Enseignant non trouvé.' });
        }

        // Mise à jour des informations
        if (nom) enseignant.nom = nom;
        if (prenom) enseignant.prenom = prenom;
        if (email) {
            const existingEnseignant = await Enseignant.findOne({ where: { email } });
            if (existingEnseignant && existingEnseignant.idEnseignant !== id) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }
            enseignant.email = email;
        }
        if (motDePasse) {
            enseignant.motDePasse = await bcrypt.hash(motDePasse, 10); // Hasher le mot de passe
        }

        await enseignant.save(); // Enregistrer les modifications

        res.status(200).json({ message: 'Informations mises à jour avec succès.', enseignant });
    } catch (err) {
        console.error('Erreur lors de la mise à jour :', err);
        res.status(500).json({ message: 'Erreur lors de la mise à jour des informations.', error: err.message });
    }
};