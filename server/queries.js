let facultyTable = `CREATE TABLE IF NOT EXISTS Faculty (
    employmentNumber varchar(255) NOT NULL,
    fName varchar(45) NOT NULL,
    lName varchar(45) NOT NULL,
    workEmail varchar(45) NOT NULL,
    phoneNumber varchar(45) NOT NULL,
    password varchar(45) NOT NULL,
    streetAddress varchar(45) NOT NULL,
    department varchar(45) NOT NULL,
    zipCode int NOT NULL,
    city varchar(45) NOT NULL,
    state varchar(2) NOT NULL,
    country varchar(45) NOT NULL,
    PRIMARY KEY (employmentNumber)
  );`;

let updateAccount = `UPDATE Faculty 
SET 
    fName = ?,
    lName = ?,
    workEmail = ?,
    department = ?,
    streetAddress = ?,
    phoneNumber = ?,
    password = ?,
    zipCode = ?,
    city = ?,
    state = ?,
    country = ?
WHERE
    employmentNumber = ?;
`;

let foapaTable = `CREATE TABLE IF NOT EXISTS FOAPA (
    foapaName varchar(45) NOT NULL,
    foapaNumber varchar(45) NOT NULL,
    PRIMARY KEY (foapaNumber)
  );`;

let possessesTable = `
CREATE TABLE IF NOT EXISTS Possesses (
  employmentNumber varchar(255) NOT NULL,
  foapaNumber varchar(45) NOT NULL,
  PRIMARY KEY (employmentNumber, foapaNumber)
  );`;

// FOREIGN KEY (employmentNumber) REFERENCES Faculty(employmentNumber)
//ON DELETE CASCADE,
// FOREIGN KEY (foapaNumber) REFERENCES FOAPA(foapaNumber)
//ON DELETE CASCADE

let activityTable = `CREATE TABLE IF NOT EXISTS Activity (
    activityId int NOT NULL,
    foapaNumber varchar(45) NOT NULL,
    activityName varchar(45) NOT NULL,
    activityReceipt text NOT NULL,
    activityDate date NOT NULL,
    amount float NOT NULL,
    PRIMARY KEY (activityId)
    );`;
// FOREIGN KEY (foapaNumber) REFERENCES FOAPA(foapaNumber)

let reimbursementTable = `CREATE TABLE IF NOT EXISTS ReimbursementTicket (
    reimbursementId int NOT NULL,
    employmentNumber varchar(255) NOT NULL,
    eventName varchar(45) NOT NULL,
    totalAmount float NOT NULL,
    reimbursementStatus bool NOT NULL,
    reimbursementDate date NOT NULL,
    PRIMARY KEY (reimbursementId)
    );`;
// FOREIGN KEY (employmentNumber) REFERENCES Faculty(employmentNumber)

let containsTable = `CREATE TABLE IF NOT EXISTS Contains (
    reimbursementId int NOT NULL,
    activityId int NOT NULL,
    PRIMARY KEY (reimbursementId, activityId)
    );`;
// FOREIGN KEY (reimbursementId) REFERENCES ReimbursementTicket(reimbursementId),
// FOREIGN KEY (activityId) REFERENCES Activity(activityId)

export {
  facultyTable,
  foapaTable,
  possessesTable,
  activityTable,
  reimbursementTable,
  containsTable,
  updateAccount,
};
