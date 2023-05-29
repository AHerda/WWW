const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/notes", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log("Connected to Database!");})
    .catch(() => {console.error("Error connecting to Database");});

let note_schema = new mongoose.Schema({
    Title: String,
    Note: String
});
let Note = mongoose.model("Note", note_schema);

app.get("/notes", async (req, res) => {
    Note.find()
        .then(notes_list => {
            res.json(notes_list);
            console.log(notes_list);
        })
        .catch(() => {console.error("Error connecting to Database");});
});

app.post("/notes", async (req, res) => {
    let note = new Note({
        Title: bodyParser.json(req.body).Title,
        Note: bodyParser.json(req.body).Note
    });

    console.log(note);
    res.json("Done");

    /*try {
        let temp = await note.save();
        res.status(201).json(temp);
    } catch (err) {
        res.status(400).json({error: err.message});
    }*/
});

const server = app.listen(3000, () => {
    var address = server.address().address;
    var port = server.address().port;
    console.log("Server listening to https://%s:%s/", address, port);
})