const fs = require("fs");
const path = require('path');
const publicPath = path.join(__dirname, "../public");
module.exports = function(err, client, app, uri) {
    if (err) {
        return console.log("Unable to connect to server.");
    }
    console.log("Connected to MongoDB server!");
    const db = client.db(process.env.PORT ? "heroku_hjzx516b" : "beSoMusical");
    const users = db.collection("Users");
    const classes = db.collection("Classes");
    app.post("/create-assignment", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $push: {
                assignments: {
                    name: req.body.assignmentName,
                    response: ""
                }
            }
        });
        res.send("Assignment added.");
    });
    app.post("/create-piece", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $push: {
                pieces: {
                    name: req.body.pieceName,
                    progress: 0
                }
            }
        });
        res.send("Piece added.");
    });
    app.post("/update-piece", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $set: {
                "pieces.$[element].progress": Math.ceil(req.body.progress)
            }
        }, {
            arrayFilters: [{ "element.name": req.body.pieceName }]
        });
        res.send("Piece updated.");
    })
    app.post("/respond-to-assignment", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $set: {
                "assignments.$[element].response": req.body.response
            }
        }, {
            arrayFilters: [{ "element.name": req.body.assignmentName }]
        });
        res.send("Response inserted!");
    });
    app.post("/delete-assignment", (req, res) => {
        classes.updateOne({
            className: req.body.className,
        }, {
            $pull: {
                assignments: {
                    name: req.body.assignmentName
                }
            }
        });
        res.send("Assignment deleted!");
    })
    app.post("/getClass", (req, res) => {
        users.find({ username: req.body.username }).toArray().then(docs => {
            const user = docs[0];
            classes.find({ className: req.body.class }).toArray().then(docs => {
                if (docs.length > 0) {
                    const _class = docs[0];
                    fs.readFile(publicPath + "/html/class.html", (err, data) => {
                        let result = data.toString().replace(/\$\{([^}]+)\}/gs, (_, p1) => {
                            return eval(p1);
                        });
                        if (_class.pieces) {
                            result += `<h2 class="w3-padding w3-text-gray">Pieces:</h2>`;
                            _class.pieces.forEach(piece => {
                                result += `<div class="progress w3-gray w3-margin">
                                <div class="progress-bar bg-info" piecename="${piece.name}" style="width:${piece.progress}%;">${piece.name} : ${piece.progress}% Progress</div>
                                </div>`;
                            });
                        }
                        if (_class.assignments) {
                            result += `<h2 class="w3-padding w3-text-gray">Assignments:</h2>`;
                            _class.assignments.sort((a, b) => {
                                a = a.name;
                                b = b.name;
                                const ISOregex = /^(\d{4})-(\d{2})-(\d{2})/;
                                const areISO = ISOregex.test(a) && ISOregex.test(b);
                                if (areISO) {
                                    const aMatches = [...ISOregex.exec(a)].slice(1).map(match => Number(match));
                                    const bMatches = [...ISOregex.exec(b)].slice(1).map(match => Number(match));
                                    const aBigger = aMatches[0] > bMatches[0] || aMatches[1] > bMatches[1] || aMatches[2] > bMatches[2];
                                    if (aBigger) {
                                        return 1;
                                    }
                                    return -1;
                                }
                                return 0;
                            });
                            _class.assignments.forEach(asgn => {
                                result += `<p class="w3-padding w3-text-gray" assignment-name="${asgn.name}">${asgn.name} - ${asgn.response ? "Response: \"" + asgn.response + "\"" : "No Response Yet"}</p>`;
                                if (user.type === "Teacher") {
                                    result += `<button class="w3-padding w3-margin w3-round w3-red w3-btn text-white">Delete Assignment</button>`;
                                }
                                result += `${ (user.type === "Student") ? "<button class=\"w3-margin-left text-white w3-blue w3-btn w3-round\">Answer Assignment</button>" : ""}`;
                            });
                        }
                        res.send(result);
                    });
                } else {
                    res.send("Error: class does not exist.");
                }
            }, err => {
                res.send("Error: unable to access database.");
            });
        });
        //res.send(req.params.class);
    })
    app.post("/sign-up", (req, res) => {
        users.find({ username: req.body.username }).toArray().then(docs => {
            if (docs.length < 1) {
                users.insertOne({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    type: req.body.type
                }, err => {
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
        users.find({ username: req.body.username, password: req.body.password })
            .toArray().then(docs => {
                if (docs.length > 0) {
                    return res.send("Login succesful!");
                }
                res.send("User does not exist.")
            }, err => {
                res.send("Error: unable to access database. " + err);
            });
    });
    app.post("/get-user-data", (req, res) => {
        users.find({ username: req.body.username, password: req.body.password })
            .toArray().then(docs => {
                if (docs.length > 0) {
                    return res.send({
                        email: docs[0].email,
                        type: docs[0].type,
                        classes: docs[0].classes,
                        invites: docs[0].invites,
                        classesJoined: docs[0].classesJoined
                    });
                }
                res.send("User does not exist.");
            }, err => {
                res.send("Error: unable to access database. " + err);
            });
    });
    app.post("/create-class", (req, res) => {
        const { className, username, password } = req.body;
        classes.insertOne({
            className,
            teacher: username,
            student: null
        }, err => {
            if (err) {
                return res.send("Unable to create class.");
            }
        })
        users.find({ username, password }).toArray().then(docs => {
            if (docs.length > 0) {
                users.updateOne({
                    username,
                    password
                }, {
                    $push: {
                        classes: {
                            className,
                            student: null
                        }
                    }
                });
                return res.send("Class added.");
            } else {
                res.send("User does not exist.");
            }
        }, err => {
            res.send("Error: unable to access database. " + err);
        });
    });
    app.post("/join-class", (req, res) => {
        const { className, teacherName, studentName } = req.body;
        classes.updateOne({
            className
        }, {
            $set: {
                student: studentName
            }
        });
        users.updateOne({
            username: teacherName
        }, {
            $set: {
                "classes.$[element].student": studentName
            }
        }, {
            arrayFilters: [{ "element.className": className }]
        });
        users.updateOne({
            username: studentName
        }, {
            $pull: {
                invites: {
                    className,
                    teacherName
                }
            },
            $push: {
                classesJoined: {
                    className,
                    teacherName
                }
            }
        });
        res.send("Done.");
    });
    app.post("/send-invite", (req, res) => {
        const { className, studentName, teacherName } = req.body;
        users.find({ username: studentName }).toArray().then(docs => {
            if (docs.length > 0) {
                if (docs[0].type === "Student") {
                    users.updateOne({
                        username: studentName
                    }, {
                        $push: {
                            invites: {
                                className,
                                teacherName
                            }
                        }
                    });
                    return res.send("Invite sent.");
                }
                return res.send("Cannot invite teacher.");
            }
            res.send("Student does not exist.");
        }, err => {
            res.send("Error: unable to access database. " + err);
        });
    });
    //client.close();
}