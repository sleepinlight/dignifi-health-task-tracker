const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var db = require("./db");

const auth = require("./middleware");

const port = 3004;

app.use(
  express.urlencoded(),
  cors({
    origin: "http://localhost:3000",
  })
);

var tasksRouter = require("./routes/tasks");

app.use("/", tasksRouter);

app.get("/", (req, res) => res.send("API Root"));

app.post("/api/register", async (req, res) => {
  var errors = [];
  try {
    const { username, email, password } = req.body;

    if (!username) {
      errors.push("username is missing");
    }
    if (!email) {
      errors.push("email is missing");
    }
    if (errors.length) {
      res.status(400).json({ error: errors.join(",") });
      return;
    }
    let userExists = false;

    var sql = "SELECT * FROM Users WHERE email = ?";
    await db.all(sql, email, (err, result) => {
      if (err) {
        res.status(402).json({ error: err.message });
        return;
      }

      if (result.length === 0) {
        var salt = bcrypt.gensaltSync(10);

        var data = {
          username: username,
          email: email,
          password: bcrypt.hashSync(password, salt),
          salt: salt,
          dateCreated: Date("now"),
        };

        var sql =
          "INSERT INTO Users (username, email, password, salt, dateCreated) VALUES (?,?,?,?,?)";
        var params = [
          data.username,
          data.email,
          data.password,
          data.salt,
          Date("now"),
        ];
        var user = db.run(sql, params, (err, innerResult) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
        });
      } else {
        userExists = true;
        // res.status(404).send("User Already Exist. Please Login");
      }
    });

    setTimeout(() => {
      if (!userExists) {
        res.status(201).json("Success");
      } else {
        res.status(201).json("Record already exists. Please login");
      }
    }, 500);
  } catch (err) {
    console.log(err);
  }
});

// * L O G I N

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Make sure there is an email and password in the request
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }

    let user = [];

    var sql = "SELECT * FROM Users WHERE email = ?";
    db.all(sql, email, (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      rows.forEach((row) => {
        user.push(row);
      });

      var PHash = bcrypt.hashSync(password, user[0].salt);

      if (PHash === user[0].password) {
        // * CREATE JWT TOKEN
        const token = jwt.sign(
          { user_id: user[0].Id, username: user[0].username, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
          }
        );

        user[0].Token = token;
      } else {
        return res.status(400).send("No Match");
      }

      return res.status(200).send({ Token: user[0].Token });
    });
  } catch (err) {
    console.log(err);
  }
});

// * T E S T

app.post("/api/test", auth, (req, res) => {
  res.status(200).send("Token Works - Yay!");
});

app.listen(port, () => console.log(`API listening on port ${port}!`));
