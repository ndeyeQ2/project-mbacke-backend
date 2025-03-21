const Exam = require('./Exam');
const Copy = require('./Copy');
const Statistique = require('./Statistique');
const Enseignant = require('./Enseignant'); // Exemple
const Matiere = require('./Matiere'); // Exemple
const Etudiant = require('./Etudiant'); // Exemple

// Définir les relations ici
Exam.hasMany(Copy, { foreignKey: 'idExamen' });
Copy.belongsTo(Exam, { foreignKey: 'idExamen' });

Exam.hasOne(Statistique, { foreignKey: 'idExamen' });
Statistique.belongsTo(Exam, { foreignKey: 'idExamen' });

Exam.belongsTo(Enseignant, { foreignKey: 'idEnseignant' });
Exam.belongsTo(Matiere, { foreignKey: 'idMatiere' });

Copy.belongsTo(Etudiant, { foreignKey: 'idEtudiant' });

// Exporter tous les modèles
module.exports = {
    Exam,
    Copy,
    Statistique,
    Enseignant,
    Matiere,
    Etudiant,
};
