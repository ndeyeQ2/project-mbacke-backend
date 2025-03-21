const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, 'uploads');


// Vérifie si le dossier existe, sinon, le crée
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const filePath = path.join(__dirname, 'mon-fichier.txt'); // Correct
console.log(filePath); // Devrait afficher un chemin absolu

//fs.readFileSync("path");


// Configuration de multer : définir le dossier où les fichiers seront stockés
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Le dossier où les fichiers seront sauvegardés
    },
    filename: (req, file, cb) => {
        // Donne un nom unique au fichier (par exemple, en utilisant un timestamp + extension du fichier)
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
