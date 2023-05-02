import * as express from "express";
import connection from "../db";

const router = express.Router();

router.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users: ", err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
});

export default router;
