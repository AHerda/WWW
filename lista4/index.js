const express = require("express");
const mongoose = require("mongoose");

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

app.get("/note", async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/note/:id", getNote, async (req, res) => {
    res.status(201).json(res.note);
});

app.post("/note", async (req, res) => {
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

app.put("/note/:id", getNote, async (req, res) => {
    res.note.Title = req.body.Title;
    res.note.Note = req.body.Note;

    try {
        const temp = await res.note.save();
        res.status(203).json("Changed to: " + temp);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

app.delete("/note/:id", getNote, async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(203).json("Deleted: " + res.note);
    } catch (err) {
        res.status(500).json({message: err.message});
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