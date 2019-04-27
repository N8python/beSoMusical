module.exports = function(err, client, app, uri) {
    if (err) {
        return console.log("Unable to connect to server.");
    }
    console.log("Connected to MongoDB server!");
    const db = client.db(process.env.PORT ? "heroku_hjzx516b" : "beSoMusical");
    const users = db.collection("Users");
    app.post("/sign-up", (req, res) => {
        users.find({ email: req.body.email }).toArray().then(docs => {
            if (docs.length < 1) {
                users.insertOne({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    type: req.body.type
                }, (err, result) => {
                    if (err) {
                        return res.send("Error: unable to insert user.");
                    }
                    return res.send("User inserted!");
                })
            } else {
                res.send("Cannot sign up twice.")
            }
        }, err => {
            console.log(err);
            res.send("Error: unable to access database. " + err + "." + `URI: ${uri}`);
        });
    });
    app.post("/log-in", (req, res) => {
        console.log("THE POST HAPPENED!");
        users.find({ username: req.body.username, password: req.body.password })
            .toArray().then(docs => {
                if (docs.length > 0) {
                    return res.send("Login succesful!")
                }
                res.send("User does not exist.")
            }, err => {
                console.log(err);
                res.send("Error: unable to access database. " + err);
            });
    });
    //client.close();
}