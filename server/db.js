var sqlite3 = require("sqlite3").verbose();
var bcrypt = require("bcrypt");
var mkdirp = require("mkdirp");

const DBSOURCE = "tasksdb.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  } else {
    var salt = bcrypt.genSaltSync(10);

    //Create DB and seed with initial records

    db.run(
      `CREATE TABLE IF NOT EXISTS Users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username text,
              email text UNIQUE,
              password text,
              salt text,
              token text,
              dateLoggedIn DATE,
              dateCreated DATE
              )`,
      (err) => {
        if (err) {
          console.error(err.message);
          throw err;
        } else {
          var insert =
            "INSERT OR REPLACE INTO Users (username, email, password, salt, dateCreated) VALUES (?,?,?,?,?)";
          db.run(insert, [
            "user1",
            "user1@example.com",
            bcrypt.hashSync("user1", salt),
            salt,
            Date("now"),
          ]);
          db.run(insert, [
            "user2",
            "user2@example.com",
            bcrypt.hashSync("user2", salt),
            salt,
            Date("now"),
          ]);
        }
      }
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS Tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text,
            notes text,
            completed INTEGER DEFAULT 0,
            reminderSet INTEGER DEFAULT 0,
            reminderDate DATE,
            dateCreated DATE,
            userId INTEGER,
            FOREIGN KEY(UserId) REFERENCES Users(Id)
            )`,
      (err) => {
        if (err) {
          console.error(err.message);
          throw err;
        } else {
          var insert =
            "INSERT INTO Tasks (title, notes, dateCreated, userId) VALUES (?,?,?,?)";
          db.run(insert, ["First Task", "some notes", Date("now"), 1]);
          db.run(insert, ["Second Task", "some more notes", Date("now"), 1]);
          db.run(insert, ["Third Task", "even more notes", Date("now"), 2]);
          db.run(insert, ["Fourth Task", "notes again", Date("now"), 1]);
        }
      }
    );
  }
});

module.exports = db;
