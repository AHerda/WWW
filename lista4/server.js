const express = require('express');
const mongoose = require('mongoose');

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://127.0.0.1/notes', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Definicja schematu dla notatki
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

// Model notatki
const Note = mongoose.model('Note', noteSchema);

const app = express();

app.use(express.json());

// Endpoint: Zwraca listę wszystkich notatek
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Endpoint: Zwraca pojedynczą notatkę według ID
app.get('/notes/:id', getNote, (req, res) => {
    res.json(res.note);
});

// Endpoint: Tworzy nową notatkę
app.post('/notes', async (req, res) => {
    const note = new Note({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const newNote = await note.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Endpoint: Aktualizuje notatkę według ID
app.put('/notes/:id', getNote, async (req, res) => {
    res.note.title = req.body.title;
    res.note.content = req.body.content;

    try {
        const updatedNote = await res.note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Endpoint: Usuwa notatkę według ID
app.delete('/notes/:id', getNote, async (req, res) => {
    try {
        await res.note.remove();
        res.json({ message: 'Note deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware do pobrania notatki według ID
async function getNote(req, res, next) {
    let note;
    try {
        note = await Note.findById(req.params.id);
        if (note == null) {
            return res.status(404).json({ message: 'Note not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.note = note;
    next();
}

// Start serwera
app.listen(3000, () => {
    console.log('Server started on port 3000');
});