const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/notes", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log("Connected to Database!");})
    .catch(() => {console.error("Error connecting to Database");});

const note_schema = new mongoose.Schema({
    Title: String,
    Note: String
}, {
    versionKey: false
});
const Note = mongoose.model("Note", note_schema);

app.get("/note", authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/note/:id", authenticateToken, getNote, async (req, res) => {
    res.status(201).json(res.note);
});

app.post("/note", authenticateToken, async (req, res) => {
    const file_content = req.body;
    const note = new Note({
        Title: file_content.Title,
        Note: file_content.Note
    });

    try {
        const temp = await note.save();
        console.log(file_content)
        res.status(202).json("Added: " + temp);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

app.put("/note/:id", authenticateToken, getNote, async (req, res) => {
    res.note.Title = req.body.Title;
    res.note.Note = req.body.Note;

    try {
        const temp = await res.note.save();
        res.status(203).json("Changed to: " + temp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.delete("/note/:id", authenticateToken, getNote, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(203).json("Deleted: " + res.note);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/login', (req, res) => {
    // Tutaj można dodać logikę weryfikacji użytkownika na podstawie przesłanych danych logowania

    const username = 'admin';
    const password = 'admin';

    if (req.body.username === username && req.body.password === password) {
        const token = jwt.sign({ username: username }, 'secret_key');
        res.json({ token: token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

const server = app.listen(3000, () => {
    let address = server.address().address;
    let port = server.address().port;
    console.log("Server listening to https://%s:%s/notes", address, port);
})

// Funkcje pomocnicze
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

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token', "token": token});
        }
        req.user = user;
        next();
    });
}