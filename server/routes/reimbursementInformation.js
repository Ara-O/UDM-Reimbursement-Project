import { Router } from "express";
const router = Router();
import connection from "../db.js";

router.post("/addReimbursement", (req, res) => {
  const {
    reimbursementId,
    employmentNumber,
    eventName,
    totalAmount,
    reimbursementStatus,
    reimbursementDate,
    allActivities,
  } = req.body;

  let promises = [];

  promises.push(
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO ReimbursementTicket VALUES(?,?,?,?,?,?)",
        [
          reimbursementId,
          employmentNumber,
          eventName,
          totalAmount,
          reimbursementStatus,
          reimbursementDate,
        ],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    })
  );

  allActivities.forEach((activity) => {
    const insertQuery = `INSERT INTO Activity VALUES (?,?,?,?,?,?)`;
    const values = [
      activity.activityId,
      activity.foapaNumber,
      activity.activityName,
      activity.activityReceipt,
      activity.activityDate,
      activity.amount,
    ];

    promises.push(
      new Promise((resolve, reject) => {
        connection.query(insertQuery, values, function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      })
    );

    promises.push(
      new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO Contains VALUES(?, ?)",
          [reimbursementId, activity.activityId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      })
    );
  });

  Promise.all(promises)
    .then(() => {
      res.status(200).send("Data inserted successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

router.get("/retrieveReimbursements", (req, res) => {
  const employmentNumber = req.query.employmentNumber;
  console.log("empl num :" + employmentNumber);
  connection.query(
    "SELECT * FROM ReimbursementTicket WHERE employmentNumber =  ?",
    employmentNumber,
    (err, rows) => {
      if (err) {
        console.log(err);
        res
          .status(404)
          .send({ message: "Error retrieving reimbursement tickets" });
      } else {
        res.status(200).send(rows);
        console.log(rows);
      }
    }
  );
});

router.get("/retrieveTicketInformation", (req, res) => {
  console.log("retrieve called");
  const promises = [];
  const employmentNumber = req.query.employmentNumber;
  const reimbursementId = req.query.reimbursementId;
  console.log("empl num :" + employmentNumber);
  promises.push(
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM ReimbursementTicket WHERE employmentNumber =  ? AND reimbursementId = ?",
        [employmentNumber, reimbursementId],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
            console.log(rows);
          }
        }
      );
    })
  );

  promises.push(
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT activityId FROM Contains WHERE reimbursementId = ?",
        reimbursementId,
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            let allActivities = [];
            rows.forEach((activity) => {
              allActivities.push(activity.activityId);
            });

            connection.query(
              "SELECT * FROM Activity WHERE activityId IN (?)",
              [allActivities],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  reject(err);
                } else {
                  resolve(rows);
                }
              }
            );
          }
        }
      );
    })
  );

  const allPromises = Promise.all(promises);

  allPromises
    .then((response) => {
      console.log(response);
      console.log("promise success");
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(401).send(err);
    });
});

router.post("/updateReimbursement", (req, res) => {
  //TODO: temporary, till we figure out a way to host with foreign key support
  const {
    reimbursementId,
    employmentNumber,
    allActivities,
    eventName,
    totalAmount,
    reimbursementStatus,
    reimbursementDate,
  } = req.body;
  const promises = [];

  promises.push(
    new Promise((resolve, reject) => {
      connection.query(
        "SELECT activityId FROM Contains WHERE reimbursementId = ?",
        [reimbursementId],
        (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve();
            console.log(rows);
            connection.query(
              "DELETE FROM Contains WHERE reimbursementId = ?",
              [reimbursementId],
              (err, rows) => {
                if (err) {
                  reject(err);
                }
              }
            );

            let allActivitiesId = rows.map((row) => row.activityId);
            connection.query(
              "DELETE FROM Activity WHERE activityId IN (?)",
              [allActivitiesId],
              (err, rows) => {
                if (err) {
                  reject(err);
                } else {
                  connection.query(
                    "DELETE FROM ReimbursementTicket WHERE reimbursementId = ?",
                    [reimbursementId],
                    (err, rows) => {
                      if (err) {
                        console.log(err);
                        reject(err);
                      } else {
                        console.log("removed reimbursementtickets");
                        console.log("promsie");
                        // resolve();
                        connection.query(
                          "INSERT INTO ReimbursementTicket VALUES(?,?,?,?,?,?)",
                          [
                            reimbursementId,
                            employmentNumber,
                            eventName,
                            totalAmount,
                            reimbursementStatus,
                            reimbursementDate,
                          ],
                          (err) => {
                            if (err) {
                              reject(err);
                            }
                          }
                        );

                        allActivities.forEach((activity) => {
                          const insertQuery = `INSERT INTO Activity VALUES (?,?,?,?,?,?)`;
                          const values = [
                            activity.activityId,
                            activity.foapaNumber,
                            activity.activityName,
                            activity.activityReceipt,
                            activity.activityDate,
                            activity.amount,
                          ];

                          connection.query(insertQuery, values, function (err) {
                            if (err) {
                              reject(err);
                            }
                          });

                          connection.query(
                            "INSERT INTO Contains VALUES(?, ?)",
                            [reimbursementId, activity.activityId],
                            function (err) {
                              if (err) {
                                reject(err);
                              } else {
                                resolve();
                              }
                            }
                          );
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    })
  );

  Promise.all(promises)
    .then(() => {
      res.status(200).send("Data inserted successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});
export default router;
