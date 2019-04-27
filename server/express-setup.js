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
process.env.MONGODB_URI = "mongodb://theguchi:bon123@ds149056.mlab.com:49056/heroku_hjzx516b";
MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/beSoMusical", (err, client) => { mongoHandler(err, client, app, process.env.MONGODB_URI) });


module.exports.listen = port => {
    server.listen(port, () => {
        console.log(`Server up on port ${port}`);
    });
}
module.exports.io = io;