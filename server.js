var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
var port = process.env.PORT || 3000;

// Parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

const root = require('path').join(__dirname, 'client', 'build');
// public folder
app.use(express.static(root));

app.get("*", function(req, res) {
    // this is a way to send a file. It will create correct path for Mac & PC
    res.sendFile( "index.html", { root });
});

// routes
// require("./routes/twitter-api-routes.js");

app.listen(port, function() {
    console.log("listening on port", port);
});
