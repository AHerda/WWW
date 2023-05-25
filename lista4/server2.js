var express = require("express");
var mongoose = require("mongoose");
var app = express();

app.use(express.static("../html"));

var server = app.listen(3001, function () {
    app.get("/", function (req, res) {
    console.log("Otrzymano ˙z ˛adanie GET dla strony głównej");
    res.send("Hello GET");
    })
    app.post("/", function (req, res) {
    console.log("Otrzymano ˙z ˛adanie POST dla strony głównej");
    res.send("Hello POST");
    })
    app.delete("/usun", function (req, res) {
    console.log("Otrzymano ˙z ˛adanie DELETE dla strony /usun");
    res.send("Hello DELETE");
    })
    app.get("/user_list", function (req, res) {
    console.log("Otrzymano ˙z ˛adanie GET dla strony /user_list");
    res.send("Listing u˙zytkowników");
    })
    app.get("/ab*cd", function(req, res) {
    console.log("Otrzymano ˙z ˛adanie GET dla strony /ab*cd");
    res.send("Dopasowanie strony ze wzorcem ab*cd");
    })
})

app.use(express.static("../html"));
app.get("index.html", function (req, res) {
res.sendFile( __dirname + "/html" + "get.html" );
});
app.get("/form_get", function (req, res) {
let response = {
    gromada:req.query.gromada,
    rodzaj:req.query.rodzaj,
    gatunek:req.query.gatunek
};
console.log(response);
res.end(JSON.stringify(response));
})