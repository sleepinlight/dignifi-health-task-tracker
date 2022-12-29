const express = require("express");
const db = require("../db");
var router = express.Router();

const coerceBoolean = (val) => {
  let boolVal = val;
  if (val && typeof val === "string") {
    boolVal = JSON.parse(val);
  }
  return boolVal;
};

const setReminderDateDefault = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000);
};

router.get(
  "/api/tasks/:userId",
  (req, res, next) => {
    // if (!req.user) {
    //   res.status(400).json({ error: err.message });
    //   return;
    // }
    next();
  },
  (req, res, next) => {
    db.all(
      "SELECT * FROM Tasks WHERE userId = ?",
      [req.params.userId],
      (err, rows) => {
        if (err) {
          return next(err);
        }

        var tasks = rows.map((row) => {
          return {
            id: row.id,
            title: row.title,
            notes: row.notes,
            completed: row.completed == 1 ? true : false,
            reminderSet: row.reminderSet == 1 ? true : false,
            reminderDate: row.reminderDate,
          };
        });
        res.tasks = tasks;
        next();
      }
    );
  },
  (req, res, next) => {
    return res.status(200).json(res.tasks);
  }
);

router.post(
  "/api/tasks",
  (req, res, next) => {
    req.body.title = req.body.title.trim();
    next();
  },
  ((req, res, next) => {
    if (req.body.title !== "") {
      return next();
    }
    return res.redirect("/" + (req.body.filter || ""));
  },
  (req, res, next) => {
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
      (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json(null);
      }
    );
  })
);

router.put("/api/task/:id/complete", (req, res, next) => {
  if (req.params.id) {
    db.run(
      "UPDATE tasks SET completed = ? WHERE id = ?",
      [coerceBoolean(req.body.completed) ? 1 : 0, req.params.id],
      (err) => {
        if (err) {
          return next(err);
        }
        return res.status(204).json(null);
      }
    );
  }
});

router.put("/api/task/:id/reminder", (req, res, next) => {
  const test = new Date();
  console.log(test);
  console.log(test.getTime());
  console.log(setReminderDateDefault(new Date(), 10));
  if (req.params.id) {
    db.run(
      "UPDATE tasks SET reminderSet = ?, reminderDate = ? WHERE id = ?",
      [
        coerceBoolean(req.body.reminderSet) ? 1 : 0,
        setReminderDateDefault(new Date(), 10),
        req.params.id,
      ],
      (err) => {
        if (err) {
          return next(err);
        }
        return res.status(204).json(null);
      }
    );
  }
});

router.delete("/api/task/:id/delete", (req, res, next) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json(null);
  });
});

module.exports = router;
