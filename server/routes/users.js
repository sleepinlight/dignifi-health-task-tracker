const express = require("express");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const db = require("../db");
var router = express.Router();

router.post("/api/register", async (req, res) => {
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
        var salt = bcrypt.genSaltSync(10);

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
        res.status(404).send("User Already Exist. Please Login");
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

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
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

      console.log(rows);

      rows.forEach((row) => {
        user.push(row);
      });

      console.log(user);

      var PHash = bcrypt.hashSync(password, user[0].salt);

      if (PHash === user[0].password) {
        const token = jwt.sign(
          { user_id: user[0].Id, username: user[0].username, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );

        user[0].token = token;
      } else {
        return res.status(400).send("No Match");
      }

      return res.status(200).send({
        id: user[0].id,
        username: user[0].username,
        token: user[0].token,
        dateLoggedIn: user[0].dateLoggedIn,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Login Failed");
  }
});

module.exports = router;
