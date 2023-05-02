import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mysql from "mysql";
import * as dotenv from "dotenv";
import { initializeApp } from "firebase/app";

dotenv.config();
import {
  facultyTable,
  foapaTable,
  possessesTable,
  activityTable,
  reimbursementTable,
  containsTable,
  updateAccount,
} from "./queries.js";
import createPdfDefinition from "./pdfGenerator.js";
import Pdfmake from "pdfmake";
// import { font } from "pdfkit";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   port: 3306,
//   password: "password",
//   database: "reimbursement_db",
// });

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect(function (err) {
  if (err) throw err;
});

//Creating all the necessary tables
connection.query(facultyTable, (err) => {
  if (err) console.log(err);
});

connection.query(foapaTable, (err) => {
  if (err) console.log(err);
});

connection.query(possessesTable, (err) => {
  if (err) console.log(err);
});

connection.query(activityTable, (err) => {
  if (err) console.log(err);
});

connection.query(reimbursementTable, (err) => {
  if (err) console.log(err);
});

connection.query(containsTable, (err) => {
  if (err) console.log(err);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

function registerUser(req, res) {
  const {
    employmentNumber,
    firstName,
    lastName,
    workEmail,
    phoneNumber,
    password,
    mailingAddress,
    department,
    zipCode,
    city,
    state,
    country,
    userFoapas,
  } = req.body;
  const promises = [];

  console.log(userFoapas);

  // Insert into faculty
  promises.push(
    new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO Faculty VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          employmentNumber,
          firstName,
          lastName,
          workEmail,
          phoneNumber,
          password,
          mailingAddress,
          department,
          zipCode,
          city,
          state,
          country,
        ],
        (err) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            if (userFoapas.length !== 0) {
              userFoapas.forEach((userFoapa) => {
                let concatFoapa =
                  userFoapa.fNumber +
                  "-" +
                  userFoapa.oNumber +
                  "-" +
                  userFoapa.aNumber +
                  "-" +
                  userFoapa.pNumber +
                  "-" +
                  userFoapa.a2Number;
                console.log(concatFoapa);

                connection.query(
                  "SELECT * FROM FOAPA WHERE foapaNumber = ?",
                  [concatFoapa],
                  (err, rows) => {
                    if (err) {
                      console.log(err);
                      reject(err);
                    }
                    console.log("rows" + rows);
                    if (rows !== undefined) {
                      if (rows.length <= 0) {
                        connection.query("INSERT INTO FOAPA VALUES(?,?)", [
                          userFoapa.foapaName,
                          concatFoapa,
                        ]);
                      }
                    }

                    connection.query(
                      "INSERT INTO Possesses VALUES(?,?)",
                      [employmentNumber, concatFoapa],
                      (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      }
                    );
                  }
                );
              });
            } else {
              resolve();
            }
          }
        }
      );
    })
  );

  Promise.all(promises)
    .then(() => {
      res.status(200).send({ message: "success" });
    })
    .catch((err) => {
      console.error(err);
      res.status(409).send({ message: "Error inserting into table" });
    });
}

function updateAccountInfo(req, res) {
  console.log("Teehee Ethan Employment Numba: " + req.body.employmentNumber);

  connection.query(
    updateAccount,
    [
      req.body.fName,
      req.body.lName,
      req.body.workEmail,
      req.body.department,
      req.body.streetAddress,
      req.body.phoneNumber,
      req.body.password,
      req.body.zipCode,
      req.body.city,
      req.body.state,
      req.body.country,
      req.body.employmentNumber,
    ],
    (err) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Error updating account information!" });
      } else {
        console.log("success");
        res.status(200).json({ message: "success!" });
      }
    }
  );
}

function retrieveFoapaNumbers(req, res) {
  const employmentNumber = req.query.employmentNumber;
  console.log("this is the employment number " + employmentNumber);
  connection.query(
    "SELECT * FROM Possesses WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving data" });
      } else {
        res.json(rows);
      }
    }
  );
}

// function retrieveFoapaName(req,res){
//   const {
//     userFoapas,
//   } = req.body;
//   userFoapas.forEach((userFoapa)=>{
//     let concatFoapa = userFoapa.fNumber + "-" + userFoapa.oNumber + "-" + userFoapa.aNumber + "-" + userFoapa.pNumber + "-" + userFoapa.a2Number

//   connection.query(
//     "SELECT foapaName, foapaNumber FROM foapa WHERE foapaNumber = ?",
//     [concatFoapa],
//     (err, rows) => {
//       if(err){
//         res.status(500).json({message: "Error retrieving data"});
//       } else{
//         res.json(rows);
//       }
//     }
//   )
// })
// }

function retrieveUserInformation(req, res) {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT fName as firstName, lName as lastName, workEmail, phoneNumber, employmentNumber FROM Faculty WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving user information" });
      } else {
        console.log("user info rows " + rows);
        res.json(rows);
      }
    }
  );
}

function retrieveAccountInfo(req, res) {
  const employmentNumber = req.query.employmentNumber;
  connection.query(
    "SELECT * FROM Faculty WHERE employmentNumber = ?",
    [employmentNumber],
    (err, rows) => {
      if (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Error retrieving account information" });
      } else {
        console.log("user info rows " + rows);
        res.json(rows);
      }
    }
  );
}

function addReimbursement(req, res) {
  console.log(req.body);
  const {
    reimbursementId,
    employmentNumber,
    eventName,
    totalAmount,
    reimbursementStatus,
    reimbursementDate,
    allActivities,
  } = req.body;

  console.log(reimbursementId);
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
}

function addFoapaNumber(req, res) {
  const employmentNumber = req.body.empNo;
  const foapaNumber = req.body.foapaNumber;

  connection.query(
    "SELECT * from FOAPA WHERE foapaNumber = ?",
    [foapaNumber],
    (err, rows) => {
      if (err) {
        res.status(409).send({ message: "FOAPA already exists" });
      }

      if (rows.length <= 0) {
        connection.query("INSERT INTO FOAPA VALUES(?,?)", [
          foapaNumber,
          foapaNumber,
        ]);
      }

      connection.query(
        "INSERT INTO Possesses VALUES(?,?)",
        [employmentNumber, foapaNumber],
        (err) => {
          res.status(200).send("success");
        }
      );
    }
  );
}

//Deleting the foapa
function deleteFoapaNumber(req, res) {
  const employmentNumber = req.body.empNo2;
  const foapaNumber = req.body.foapaNumber2;
  console.log(employmentNumber + "+" + foapaNumber);

  connection.query(
    "DELETE FROM Possesses WHERE employmentNumber = ? AND foapaNumber = ?",
    [employmentNumber, foapaNumber],
    (err) => {
      if (err) {
        console.log("the error is" + err);
      }
    }
  );

  connection.query(
    "Delete from FOAPA where foapaNumber = ?",
    [foapaNumber],
    (err) => {
      res.status(200).send("success");
    }
  );
}

function loginUser(req, res) {
  const { workEmail, password } = req.body;
  console.log(workEmail);
  connection.query(
    "SELECT password, employmentNumber FROM Faculty WHERE workEmail = ?",
    [workEmail],
    (err, rows) => {
      console.log(rows);
      if (rows.length === 0) {
        res.status(401).send({
          message:
            "Login unsuccessful; No email/Password combination was found",
        });
      } else {
        let dbPassword = rows[0].password;
        console.log(dbPassword);
        if (dbPassword === password) {
          res.status(200).send({
            message: "Login successful",
            employmentNumber: rows[0].employmentNumber,
          });
        } else {
          res.status(401).send({
            message:
              "Login unsuccessful; No email/Password combination was found",
          });
        }
      }
      if (err) {
        console.log(err);
      }
    }
  );
}

function retrieveReimbursements(req, res) {
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
}

function retrieveTicketInformation(req, res) {
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
}

// UPDATE
function updateReimbursementTicket(req, res) {
  console.log("potato");
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

  // promises.push(
  //   new Promise((resolve, reject) => {
  //     connection.query(
  //       "DELETE FROM contains WHERE reimbursementId IN (SELECT reimbursementId FROM reimbursementticket WHERE reimbursementId = ?)",
  //       [reimbursementId],
  //       (err, rows) => {
  //         if (err) {
  //           console.log(err);
  //           reject(err);
  //         } else {
  //           resolve();
  //           console.log("promsie");
  //           console.log(rows);
  //         }
  //       }
  //     );
  //   })
  // );

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

  // Promise.all(promises)
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

function generatePdf(docDefinition, callback) {
  try {
    let fonts = {
      Roboto: {
        normal: "./fonts/Arial-Light.ttf",
        bold: "./fonts/Arial-Bold.ttf",
        italics: "./fonts/Arial-Bold-Italics.ttf",
        bolditalics: "./fonts/Arial-Bold-Italics.ttf",
      },
    };

    let pdfmake = new Pdfmake(fonts);

    let pdfDoc = pdfmake.createPdfKitDocument(docDefinition, {});
    let chunks = [];
    let result;

    pdfDoc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    pdfDoc.on("end", () => {
      result = Buffer.concat(chunks);
      callback("data:application/pdf;base64," + result.toString("base64"));
    });

    pdfDoc.end();
  } catch (err) {
    console.log(err);
  }
}

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
  measurementId: process.env.FB_MEASUREMENT_ID,
  databaseURL: process.env.FB_DATABASE_URL,
};

initializeApp(firebaseConfig);

app.post("/api/register", registerUser);
//APIs
app.get("/api/retrieveFoapaNumbers", retrieveFoapaNumbers);
// app.get("/api/retriveFoapaName", retrieveFoapaName);
app.get("/api/retrieveUserInformation", retrieveUserInformation);
app.get("/api/retrieveAccountInfo", retrieveAccountInfo);
app.post("/api/updateAccountInfo", updateAccountInfo);
app.post("/api/addReimbursement", addReimbursement);
app.post("/api/addFoapaNumber", addFoapaNumber);
app.post("/api/deleteFoapaNumber", deleteFoapaNumber);
app.post("/api/addReimbursement", addReimbursement);
app.get("/api/retrieveReimbursements", retrieveReimbursements);
app.get("/api/retrieveTicketInformation", retrieveTicketInformation);
app.post("/api/updateReimbursement", updateReimbursementTicket);
app.post("/api/addFoapaNumber", addFoapaNumber);
app.post("/api/deleteFoapaNumber", deleteFoapaNumber);
app.post("/api/login", loginUser);
app.get("/api/generatePdf", function (req, res) {
  console.log(req.query);
  const docDefinition = {
    content: createPdfDefinition(
      req.query.reimbursementData,
      req.query.userInfo
    ),
    defaultStyle: {
      fontSize: 10,
      bold: true,
    },

    pageMargins: [20, 30, 0, 0],
  };
  generatePdf(
    docDefinition,
    function (base64String) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=product.pdf");
      res.send(base64String);
    },
    function (error) {
      res.send("ERROR:" + error);
    }
  );
});

// connection.query(
//   "ALTER TABLE ReimbursementTicket MODIFY employmentNumber VARCHAR(255)",
//   function (err) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("yay changed");
//     }
//   }
// );

connection.query(
  "ALTER TABLE Activity MODIFY activityReceipt TEXT",
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Ara bara tara");
    }
  }
);

// connection.query("SELECT * FROM Possesses", (err, rows) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(rows);
//   }
// });

app.get("/close", () => {
  connection.end();
});

process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    connection.end();
    process.exit(1);
  });
