const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const auth = require("./middleware");

const port = 3004;

app.use(
  express.urlencoded(),
  cors({
    origin: "http://localhost:3000",
  })
);

var tasksRouter = require("./routes/tasks");
var usersRouter = require("./routes/users");

app.use("/", tasksRouter, usersRouter);

app.get("/", (req, res) => res.send("API Root"));

app.post("/api/test", auth, (req, res) => {
  res.status(200).send("Token Works - Yay!");
});

app.listen(port, () => console.log(`API listening on port ${port}!`));
