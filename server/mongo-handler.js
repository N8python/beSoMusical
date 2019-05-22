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
    app.post("/add-message", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $push: {
                messages: {
                    message: req.body.message,
                    username: req.body.username
                }
            }
        });
        res.send("Message added.");
    });
    app.post("/create-assignment", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $push: {
                assignments: {
                    name: req.body.assignmentName,
                    response: "",
                    checked: false
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
    });
    app.post("/delete-piece", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $pull: {
                pieces: {
                    name: req.body.pieceName
                }
            }
        });
        res.send("Piece removed.");
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
    app.post("/check-assignment", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $set: {
                "assignments.$[element].checked": true
            }
        }, {
            arrayFilters: [{ "element.name": req.body.assignmentName }]
        });
        res.send("Checked.");
    });
    app.post("/uncheck-assignment", (req, res) => {
        console.log(req.body.className, req.body.assignmentName);
        classes.updateOne({
            className: req.body.className
        }, {
            $set: {
                "assignments.$[element].checked": false
            }
        }, {
            arrayFilters: [{ "element.name": req.body.assignmentName }]
        });
        res.send("Checked.");
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
    });
    app.post("/create-note", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $push: {
                notes: {
                    title: req.body.title,
                    text: req.body.text,
                    experationDate: req.body.experationDate
                }
            }
        });
        res.send("Note added!");
    });
    app.post("/delete-note", (req, res) => {
        classes.updateOne({
            className: req.body.className
        }, {
            $pull: {
                notes: {
                    title: req.body.noteName
                }
            }
        });
        res.send("Note added!");
    });
    app.post("/getClass", (req, res) => {
        users.find({ username: req.body.username }).toArray().then(docs => {
            const user = docs[0];
            classes.find({ className: req.body.class }).toArray().then(docs => {
                if (docs.length > 0) {
                    const _class = docs[0];
                    fs.readFile(publicPath + "/html/class.html", (err, data) => {
                        let pieceText = "";
                        if (_class.pieces) {
                            pieceText += `<h2 class="w3-padding w3-text-white">Pieces:</h2>`;
                            _class.pieces.forEach(piece => {
                                pieceText += `<div class="progress w3-grey w3-margin">
                                <div class="progress-bar bg-info" piecename="${piece.name}" style="width:${piece.progress}%;">${piece.name} : ${piece.progress}% Progress</div>
                                </div>`;
                                if (user.type === "Teacher") {
                                    pieceText += `<button class="w3-padding w3-margin w3-red btn text-white">Delete Piece</button>`;
                                }
                            });
                        }
                        let assignmentText = "";
                        if (_class.assignments) {
                            assignmentText += `<h2 class="w3-padding w3-text-white">Assignments:</h2>`;
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
                                return 1;
                            });
                            _class.assignments.forEach(asgn => {
                                assignmentText += `<p class="w3-padding w3-text-white" assignment-name="${asgn.name}">${asgn.name} - ${asgn.response ? "Response: \"" + asgn.response + "\"" : "No Response Yet"} 
                                ${"<input type=\"checkbox\" class=\"w3-check\"" + ((asgn.checked) ? " checked>" : ">")} </p>`;
                                if (user.type === "Teacher") {
                                    assignmentText += `<button class="w3-padding w3-margin btn text-white">Delete Assignment</button>`;
                                }
                                assignmentText += `${ (user.type === "Student") ? "<button class=\"w3-margin-left text-white btn\">Answer Assignment</button>" : ""}`;
                            });
                        }
                        let messages = "";
                        let classText = "";
                        if (_class.messages) {
                            _class.messages.forEach(message => {
                                messages += `<p>${message.message.replace(user.username, "You")}</p>`;
                            });
                        }
                        classText += `
                            <section class="w3-padding w3-indigo w3-margin w3-round-xlarge scrollToBottom" style="height: 200px; overflow:scroll;">
                                <h3>Class Chat:</h3>
                                <div class="messages">${messages}</div>
                                <script>
                                    setTimeout(() => {
                                        $(".scrollToBottom").scrollTop($(".scrollToBottom").prop("scrollHeight"));
                                    }, 10);
                                </script>
                            </section>
                            <input class="w3-margin w3-input w3-animate-input" id="enterMessage" style="width:30%" placeholder="Say something...">
                        `;
                        let noteText = `
                            <h1>Notes:</h1>
                        `;
                        if (_class.notes) {
                            _class.notes.forEach((note) => {
                                if (!((new Date().getTime()) > (new Date(note.experationDate).getTime()))) {
                                    noteText += `
                                    <section class="w3-card w3-margin">
                                        <h3 class="w3-indigo w3-padding" style="margin:0px" title="${note.title}">${note.title} <a class="w3-right" deleteNote>x</a></h3>
                                        <p class="w3-grey w3-padding" style="margin:0px">${note.text}</p>
                                        <p class="w3-blue w3-padding" style="margin:0px">Expiration Date: ${note.experationDate}</p>
                                    </section>
                                `
                                }
                            })
                        }
                        let result = data.toString().replace(/\$\{([^}]+)\}/gs, (_, p1) => {
                            return eval(p1);
                        });
                        result = result.replace(/undefined/g, "");
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