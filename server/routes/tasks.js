var express = require("express");
var db = require("../db");

function fetchTasks(req, res, next) {
  db.all(
    "SELECT * FROM Tasks WHERE userId = ?",
    [req.params.userId],
    function (err, rows) {
      if (err) {
        return next(err);
      }

      var tasks = rows.map(function (row) {
        return {
          id: row.id,
          title: row.title,
          notes: row.notes,
          completed: row.completed == 1 ? true : false,
        };
      });
      res.tasks = tasks;
      next();
    }
  );
}

var router = express.Router();

router.get(
  "/api/tasks/:userId",
  (req, res, next) => {
    console.log(req);
    // if (!req.user) {
    //   res.status(400).json({ error: err.message });
    //   return;
    // }
    next();
  },
  fetchTasks,
  function (req, res, next) {
    return res.status(200).json(res.tasks);
  }
);

router.post(
  "/api/tasks",
  (req, res, next) => {
    console.log("what");
    console.log(req);
    req.body.title = req.body.title.trim();
    next();
  },
  function (req, res, next) {
    if (req.body.title !== "") {
      return next();
    }
    return res.redirect("/" + (req.body.filter || ""));
  },
  function (req, res, next) {
    db.run(
      "INSERT INTO tasks (title, notes, reminderSet, reminderDate, dateCreated, userId) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.title,
        req.body.notes,
        req.body.reminderSet === true ? 1 : 0,
        req.body.reminderDate || null,
        Date("now"),
        req.body.userId,
      ],
      function (err) {
        if (err) {
          return next(err);
        }
        return res.status(201).json(null);
      }
    );
  }
);

router.put("/api/task/:id/complete", (req, res, next) => {});

router.put("/api/task/:id/reminder", (req, res, next) => {});

router.delete("/api/task/:id/delete", (req, res, next) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      return next(err);
    }
    return res.status(200).json(null);
  });
});

module.exports = router;
