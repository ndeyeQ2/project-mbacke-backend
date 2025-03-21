const Etudiant = require('../models/Etudiant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

    // Inscription d'un nouvel étudiant
    exports.register = async (req, res) => {
        const { idEtudiant,  email, motDePasse } = req.body;

        try {
            // Vérifier si l'étudiant existe déjà
            const existingEtudiant = await Etudiant.findOne({ where: { email } });
            if (existingEtudiant) {
                return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
            }

            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(motDePasse, 10);

            // Créer un nouvel étudiant
            const etudiant = await Etudiant.create({
                idEtudiant,
               // nom,
                // prenom,
                email,
                motDePasse: hashedPassword,
               // idClasse,
            });

            res.status(201).json({ message: 'Étudiant créé avec succès.', etudiant });
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de la création de l\'étudiant', error: err });
        }
    };

    // Connexion d'un étudiant
    exports.login = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
        }

        try {
            // Recherche de l'étudiant dans la base de données
            const etudiant = await Etudiant.findOne({ where: { email } });
            if (!etudiant) {
                return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            }
            console.log("Fi baxneu!!!")

            // Vérifier que le mot de passe stocké existe dans la base de données
            if (!etudiant.motDePasse) {
                return res.status(500).json({ message: 'Erreur interne : Mot de passe manquant dans la base de données.' });
            }

            // Comparer le mot de passe en clair avec le mot de passe haché
            const isPasswordValid = await bcrypt.compare(password, etudiant.motDePasse);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            }

            // Si le mot de passe est valide, générer un token JWT
            const token = jwt.sign(
                { id: etudiant.idEtudiant, role: 'etudiant' },
                process.env.JWT_SECRET, // Assurez-vous que vous avez défini JWT_SECRET dans vos variables d'environnement
                { expiresIn: '1h' } // Le token expire après 1 heure
            );

            // Réponse avec le token JWT
            res.status(200).json({
                message: 'Connexion réussie.',
                token, // Le token JWT pour l'authentification
                userId: etudiant.idEtudiant, // ID de l'étudiant
                role: 'etudiant', // Rôle de l'utilisateur
            });
        } catch (err) {
            console.error('Erreur lors de la connexion :', err);
            res.status(500).json({
                message: 'Erreur lors de la connexion.',
                error: err.message,
            });
        }
    };



    // Obtenir les informations d'un étudiant
    exports.getEtudiant = async (req, res) => {
        try {
            const etudiant = await Etudiant.findByPk(req.params.id, {
                attributes: { exclude: ['motDePasse'] } // Exclure le mot de passe de la réponse
            });
            if (!etudiant) {
                return res.status(404).json({ message: 'Étudiant non trouvé.' });
            }
            res.status(200).json(etudiant);
        } catch (err) {
            res.status(500).json({ message: 'Erreur lors de la récupération de l\'étudiant', error: err });
        }


    };

    exports.getEtudiantData = async (req, res) => {
        const idEtudiant = req.params.id; // Extraire idEtudiant de req.body

        try {
            // Récupérer les informations de l'étudiant
            const etudiant = await Etudiant.findOne({ where: { idEtudiant }, attributes: { exclude: ['motDePasse'] } });

            if (!etudiant) {
                return res.status(404).json({ message: 'Étudiant non trouvé.' });
            }

            // Récupérer les examens à faire et rendus
            const exams = await sequelize.query(
                `
                SELECT
                    'Examen à faire' AS type,
                    Ex.idExamen,
                    Ex.titre,
                    Ex.sujet,
                    Ex.dateLimite,
                    NULL AS dateDeSoumission,
                    NULL AS note,
                    NULL AS commentaire
                FROM
                    EXAMEN Ex
                LEFT JOIN
                    COPIE C ON C.idExamen = Ex.idExamen AND C.idEtudiant = ?
                WHERE
                    C.idCopie IS NULL
    
                UNION
    
                SELECT
                    'Examen rendu' AS type,
                    Ex.idExamen,
                    Ex.titre,
                    Ex.sujet,
                    Ex.dateLimite,
                    C.dateDeSoumission,
                    C.note,
                    C.commentaire
                FROM
                    COPIE C
                JOIN
                    EXAMEN Ex ON Ex.idExamen = C.idExamen
                WHERE
                    C.idEtudiant = ?
                `,
                {
                    replacements: [idEtudiant, idEtudiant],
                    type: sequelize.QueryTypes.SELECT
                }
            );

            if (exams.length === 0) {
                return res.status(404).json({ message: 'Aucun examen trouvé pour cet étudiant.' });
            }

            // Retourner les données de l'étudiant et les examens
            return res.status(200).json({
                Etudiant: etudiant,
                Exam: exams
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des données de l\'étudiant', error: err });
        }
    };

    // Mise à jour des informations d'un étudiant
    exports.updateEtudiant = async (req, res) => {
        const { id } = req.params; // ID de l'étudiant à mettre à jour
        const { nom, prenom, email, motDePasse } = req.body; // Champs à mettre à jour

        try {
            const etudiant = await Etudiant.findByPk(id);

            if (!etudiant) {
                return res.status(404).json({ message: 'Étudiant non trouvé.' });
            }

            // Mise à jour des informations
            if (nom) etudiant.nom = nom;
            if (prenom) etudiant.prenom = prenom;
            if (email) {
                const existingEtudiant = await Etudiant.findOne({ where: { email } });
                if (existingEtudiant && existingEtudiant.idEtudiant !== id) {
                    return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
                }
                etudiant.email = email;
            }
            if (motDePasse) {
                etudiant.motDePasse = await bcrypt.hash(motDePasse, 10); // Hasher le mot de passe
            }

            await etudiant.save(); // Enregistrer les modifications

            res.status(200).json({ message: 'Informations mises à jour avec succès.', etudiant });
        } catch (err) {
            console.error('Erreur lors de la mise à jour :', err);
            res.status(500).json({ message: 'Erreur lors de la mise à jour des informations.', error: err.message });
        }
    };
