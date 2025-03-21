-- Supprimer la base de données si elle existe
DROP DATABASE IF EXISTS exam_platform;

-- Créer la base de données
CREATE DATABASE exam_platform;

-- Créer l'utilisateur et lui accorder les privilèges
CREATE USER IF NOT EXISTS GestionnaireExam@"localhost" IDENTIFIED BY "passer";
GRANT ALL PRIVILEGES ON exam_platform.* TO GestionnaireExam@"localhost";
FLUSH PRIVILEGES;

-- Utiliser la base de données
USE exam_platform;

-- Créer la table CLASSE
CREATE TABLE CLASSE (
    idClasse INT AUTO_INCREMENT,
    nomClasse VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY(idClasse)
);

-- Créer la table MATIERE
CREATE TABLE MATIERE (
    idMatiere INT AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL UNIQUE,
    PRIMARY KEY(idMatiere)
);

-- Créer la table ETUDIANT
CREATE TABLE ETUDIANT (
    idEtudiant CHAR(9), -- 20220**** par exemple
    nom VARCHAR(20),
    prenom VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    idClasse INT,
    PRIMARY KEY(idEtudiant),
    FOREIGN KEY(idClasse) REFERENCES CLASSE(idClasse) ON DELETE SET NULL
);

-- Créer la table ENSEIGNANT
CREATE TABLE ENSEIGNANT (
    idEnseignant CHAR(9),
    nom VARCHAR(20),
    prenom VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    motDePasse VARCHAR(255) NOT NULL,
    idMatiere INT,
    PRIMARY KEY(idEnseignant),
    FOREIGN KEY(idMatiere) REFERENCES MATIERE(idMatiere) ON DELETE SET NULL
);

-- Créer la table EXAMEN
CREATE TABLE EXAMEN (
    idExamen INT AUTO_INCREMENT,
    titre VARCHAR(50) NOT NULL,
    sujet VARCHAR(500) NOT NULL,
    dateDeCreation DATETIME DEFAULT CURRENT_TIMESTAMP,
    dateLimite DATETIME NOT NULL,
    idEnseignant CHAR(9),
    idMatiere INT,
    PRIMARY KEY(idExamen),
    FOREIGN KEY(idEnseignant) REFERENCES ENSEIGNANT(idEnseignant) ON DELETE CASCADE,
    FOREIGN KEY(idMatiere) REFERENCES MATIERE(idMatiere) ON DELETE SET NULL,
    CHECK (dateLimite > dateDeCreation)
);

-- Créer la table NOTIF
CREATE TABLE NOTIF (
    idNotification INT AUTO_INCREMENT,
    message VARCHAR(5000) NOT NULL,
    dateEtHeure DATETIME DEFAULT CURRENT_TIMESTAMP,
    idEtudiant CHAR(9),
    idExamen INT,
    PRIMARY KEY(idNotification),
    FOREIGN KEY(idEtudiant) REFERENCES ETUDIANT(idEtudiant) ON DELETE CASCADE,
    FOREIGN KEY(idExamen) REFERENCES EXAMEN(idExamen) ON DELETE CASCADE
);

-- Créer la table COPIE
CREATE TABLE COPIE (
    idCopie INT AUTO_INCREMENT,
    fichier VARCHAR(5000) NOT NULL,
    dateDeSoumission DATETIME DEFAULT CURRENT_TIMESTAMP,
    note DECIMAL(5,2),
    commentaire VARCHAR(1000),
    idExamen INT,
    idEtudiant CHAR(9),
    PRIMARY KEY(idCopie),
    FOREIGN KEY(idExamen) REFERENCES EXAMEN(idExamen) ON DELETE CASCADE,
    FOREIGN KEY(idEtudiant) REFERENCES ETUDIANT(idEtudiant) ON DELETE CASCADE,
    UNIQUE(idExamen, idEtudiant)
);

-- Créer la table PLAGIAT
CREATE TABLE PLAGIAT (
    idPlagiat INT AUTO_INCREMENT,
    idCopie1 INT,
    idCopie2 INT,
    tauxSimilarite REAL CHECK (tauxSimilarite >= 0 AND tauxSimilarite <= 100),
    PRIMARY KEY(idPlagiat),
    FOREIGN KEY(idCopie1) REFERENCES COPIE(idCopie) ON DELETE CASCADE,
    FOREIGN KEY(idCopie2) REFERENCES COPIE(idCopie) ON DELETE CASCADE
);

-- Créer la table CORRECTION
CREATE TABLE CORRECTION (
    idCorrection INT AUTO_INCREMENT,
    idCopie INT NOT NULL,
    noteIa DECIMAL(5,2) CHECK (noteIa >= 0 AND noteIa <= 20),
    noteProf DECIMAL(5,2) CHECK (noteProf >= 0 AND noteProf <= 20),
    PRIMARY KEY(idCorrection),
    FOREIGN KEY(idCopie) REFERENCES COPIE(idCopie) ON DELETE CASCADE
);

-- Créer la table NOTES
CREATE TABLE NOTES (
    idNote INT AUTO_INCREMENT,
    idCopie INT NOT NULL,
    note DECIMAL(5,2) CHECK (note >= 0 AND note <= 20),
    source VARCHAR(20) CHECK (source IN ('IA', 'Prof')), -- Source de la note
    PRIMARY KEY(idNote),
    FOREIGN KEY(idCopie) REFERENCES COPIE(idCopie) ON DELETE CASCADE
);

-- Créer la table STATISTIQUES
CREATE TABLE STATISTIQUES (
    idStatistique INT AUTO_INCREMENT,
    moyenne DECIMAL(5,2),
    tauxReussite DECIMAL(5,2),
    PRIMARY KEY(idStatistique),
    idExamen INT,
    FOREIGN KEY(idExamen) REFERENCES EXAMEN(idExamen) ON DELETE CASCADE
);

-- Créer la table COMMENTAIRE
CREATE TABLE COMMENTAIRE (
    idCommentaire INT AUTO_INCREMENT,
    contenu VARCHAR(500) NOT NULL,
    idEtudiant CHAR(9) NULL,
    idEnseignant CHAR(9) NULL,
    idExamen INT NOT NULL,
    dateModification DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (idCommentaire),
    FOREIGN KEY (idEtudiant) REFERENCES ETUDIANT(idEtudiant) ON DELETE CASCADE,
    FOREIGN KEY (idEnseignant) REFERENCES ENSEIGNANT(idEnseignant) ON DELETE CASCADE,
    FOREIGN KEY(idExamen) REFERENCES EXAMEN(idExamen) ON DELETE CASCADE
);

-- Insérer des données fictives dans la table CLASSE
INSERT INTO CLASSE (nomClasse) VALUES
('Classe A'),
('Classe B'),
('Classe C'),
('Classe D'),
('Classe E');

-- Insérer des données fictives dans la table MATIERE
INSERT INTO MATIERE (nom) VALUES
('Mathématiques'),
('Physique'),
('Informatique'),
('Chimie'),
('Biologie');

-- Insérer des données fictives dans la table ETUDIANT
INSERT INTO ETUDIANT (idEtudiant, nom, prenom, email, motDePasse, idClasse) VALUES
('202200001', 'Dupont', 'Jean', 'jean.dupont@example.com', 'password1', 1),
('202200002', 'Martin', 'Alice', 'alice.martin@example.com', 'password2', 2),
('202200003', 'Bernard', 'Luc', 'luc.bernard@example.com', 'password3', 3),
('202200004', 'Petit', 'Sophie', 'sophie.petit@example.com', 'password4', 4),
('202200005', 'Robert', 'Paul', 'paul.robert@example.com', 'password5', 5);

-- Insérer des données fictives dans la table ENSEIGNANT
INSERT INTO ENSEIGNANT (idEnseignant, nom, prenom, email, motDePasse, idMatiere) VALUES
('100000001', 'Lefevre', 'Pierre', 'pierre.lefevre@example.com', 'password1', 1),
('100000002', 'Moreau', 'Marie', 'marie.moreau@example.com', 'password2', 2),
('100000003', 'Girard', 'Lucie', 'lucie.girard@example.com', 'password3', 3),
('100000004', 'Roux', 'Thomas', 'thomas.roux@example.com', 'password4', 4),
('100000005', 'Blanc', 'Julie', 'julie.blanc@example.com', 'password5', 5);

-- Insérer des données fictives dans la table EXAMEN
INSERT INTO EXAMEN (titre, sujet, dateLimite, idEnseignant, idMatiere) VALUES
('Examen de Mathématiques', 'Calcul différentiel et intégral', '2025-12-15 23:59:59', '100000001', 1),
('Examen de Physique', 'Mécanique classique', '2025-12-16 23:59:59', '100000002', 2),
('Examen d Informatique', 'Programmation en Python', '2025-12-17 23:59:59', '100000003', 3),
('Examen de Chimie', 'Réactions chimiques', '2025-12-18 23:59:59', '100000004', 4),
('Examen de Biologie', 'Biologie cellulaire', '2025-12-19 23:59:59', '100000005', 5);

-- Insérer des données fictives dans la table NOTIF
INSERT INTO NOTIF (message, idEtudiant, idExamen) VALUES
('Votre examen de Mathématiques est prévu pour le 15 décembre.', '202200001', 1),
('Votre examen de Physique est prévu pour le 16 décembre.', '202200002', 2),
('Votre examen d Informatique est prévu pour le 17 décembre.', '202200003', 3),
('Votre examen de Chimie est prévu pour le 18 décembre.', '202200004', 4),
('Votre examen de Biologie est prévu pour le 19 décembre.', '202200005', 5);

-- Insérer des données fictives dans la table COPIE
INSERT INTO COPIE (fichier, note, commentaire, idExamen, idEtudiant) VALUES
('fichier1.pdf', 15.5, 'Bon travail.', 1, '202200001'),
('fichier2.pdf', 12.0, 'Peut mieux faire.', 2, '202200002'),
('fichier3.pdf', 18.0, 'Excellent travail.', 3, '202200003'),
('fichier4.pdf', 10.5, 'Insuffisant.', 4, '202200004'),
('fichier5.pdf', 14.0, 'Assez bien.', 5, '202200005');

-- Insérer des données fictives dans la table PLAGIAT
INSERT INTO PLAGIAT (idCopie1, idCopie2, tauxSimilarite) VALUES
(1, 2, 25.5),
(2, 3, 30.0),
(3, 4, 15.0),
(4, 5, 10.5),
(5, 1, 20.0);

-- Insérer des données fictives dans la table CORRECTION
INSERT INTO CORRECTION (idCopie, noteIa, noteProf) VALUES
(1, 14.0, 15.5),
(2, 11.5, 12.0),
(3, 17.5, 18.0),
(4, 9.5, 10.5),
(5, 13.5, 14.0);

-- Insérer des données fictives dans la table NOTES
INSERT INTO NOTES (idCopie, note, source) VALUES
(1, 15.5, 'Prof'),
(2, 12.0, 'Prof'),
(3, 18.0, 'Prof'),
(4, 10.5, 'Prof'),
(5, 14.0, 'Prof');

-- Insérer des données fictives dans la table STATISTIQUES
INSERT INTO STATISTIQUES (moyenne, tauxReussite, idExamen) VALUES
(14.5, 80.0, 1),
(12.5, 70.0, 2),
(16.0, 90.0, 3),
(10.0, 50.0, 4),
(13.5, 75.0, 5);

-- Insérer des données fictives dans la table COMMENTAIRE
INSERT INTO COMMENTAIRE (contenu, idEtudiant, idEnseignant, idExamen) VALUES
('Très bon examen.', '202200001', NULL, 1),
('Difficile mais intéressant.', NULL, '100000002', 2),
('J ai adoré cet examen.', '202200003', NULL, 3),
('Un peu trop long.', NULL, '100000004', 4),
('Examen bien structuré.', '202200005', NULL, 5);