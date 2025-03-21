const Note = require('../models/Note');

// Créer une nouvelle note
exports.createNote = async (req, res) => {
    try {
        const { idCopie, note, source } = req.body;
        const newNote = await Note.create({ idCopie, note, source });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtenir toutes les notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtenir une note par ID
exports.getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findByPk(id);
        if (!note) {
            return res.status(404).json({ error: 'Note non trouvée' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une note
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { note, source } = req.body;

        const existingNote = await Note.findByPk(id);
        if (!existingNote) {
            return res.status(404).json({ error: 'Note non trouvée' });
        }

        existingNote.note = note;
        existingNote.source = source;
        await existingNote.save();

        res.status(200).json(existingNote);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Supprimer une note
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await Note.findByPk(id);
        if (!note) {
            return res.status(404).json({ error: 'Note non trouvée' });
        }

        await note.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
