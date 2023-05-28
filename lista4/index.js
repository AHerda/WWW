const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/notes", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {console.log("Connected to Database!");})
    .catch(() => {console.error("Error connecting to Database");});

let note_schema = new mongoose.Schema({
    _id: Number,
    Title: String,
    Note: String
});
let Note = mongoose.model("Note", note_schema);

app.get("/notes", async (req, res) => {
    console.log("Hello World");
});

const server = app.listen(3000, () => {
    var address = server.address().address;
    var port = server.address().port;
    console.log("Server listening to https://%s:%s/", address, port);
})