const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const mongoHandler = require("./mongo-handler");
const path = require('path');
const http = require('http');
const express = require("express");
const socketIO = require("socket.io");
const publicPath = path.join(__dirname, "../public");

let app = express();
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded());
let server = http.createServer(app);
let io = socketIO(server);
MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/beSoMusical", (err, client) => { mongoHandler(err, client, app) });


module.exports.listen = port => {
    server.listen(port, () => {
        console.log(`Server up on port ${port}`);
    });
}
module.exports.io = io;