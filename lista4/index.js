const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/notes')
.then(() => {console.log("Connected to Database!");})
.catch(() => {console.error("Error connecting to Database");});