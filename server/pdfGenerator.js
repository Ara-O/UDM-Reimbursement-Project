import logger from "./logger.js";
import { parseDate } from "./utils/parseDate.js";
import { formatFoapaDetails } from "./utils/formatFoapaDetails.js";
import { retrieveDate } from "./utils/retrieveDate.js";

function fillArray(arrayToBeFilled, length) {
  for (let i = 0; i < length; i++) {
    if (!arrayToBeFilled[i]) {
      arrayToBeFilled[i] = { text: "", fontSize: 7.8 };
    } else {
      if (typeof arrayToBeFilled[i] !== "object") {
        arrayToBeFilled[i] = { text: arrayToBeFilled[i], fontSize: 7.8 };
      }
    }
  }

  return arrayToBeFilled;
}

export default function createPdfDefinition(
  reimbursementData,
  facultyData,
  receiptData
) {
  const expenses = reimbursementData.activities;
  let content = [];

  logger.info("Generating PDF definition", {
    api: "createPdfDefinition",
  });

  //Top section
  content.push(
    {
      text: "EMPLOYEE EXPENSE AND TRAVEL REIMBURSEMENT (EE&TR)\n\n",
      style: "header",
      alignment: "center",
      fontSize: 11.5,
    },
    {
      text: "***FORM MUST BE SUBMITTED WITHIN 30 CALENDAR DAYS AFTER THE EXPENSE(S) HAS OCCURRED OR TRIP COMPLETED***\n\n\n",
      color: "red",
      alignment: "center",
      fontSize: 8,
    },
    {
      text: `Date Submitted:   ${retrieveDate("MM/DD/YYYY")}\n\n`,
      italics: true,
      decoration: "underline",
    }
  );

  //   Faculty information section
  let expenseTotal = 0;

  expenses.forEach((activity) => {
    // Add the cost of all expenses - in cents to prevent decimal issues
    expenseTotal += Number(activity.cost) * 100;
  });

  // Check if ticket total is not a number (should not happen, but just to be robust)
  if (isNaN(expenseTotal)) {
    expenseTotal = 0;
  }

  // Convert expense total back to dollars
  expenseTotal /= 100;

  content.push({
    table: {
      widths: [50, 40, 40, 40, 40, 40, 40, 20, 20, 40, 20, 20, 33],
      height: 0,
      headerRows: 1,
      body: [
        [
          { text: "Name & Home Mailing Address", italics: true, colSpan: 3 },
          {},
          {},
          { text: "Employee #", colSpan: 2, italics: true },
          {},
          { text: `${facultyData.employmentNumber}`, colSpan: 2 },
          {},
          { text: "Reimbursement", colSpan: 3, italics: true },
          {},
          {},
          { text: "$" + `${expenseTotal}`, colSpan: 3 },
          {},
          {},
        ],
        [
          {
            text: `${facultyData.firstName} ${facultyData.lastName}`,
            colSpan: 3,
          },
          {},
          {},
          { text: "Email", colSpan: 2, italics: true },
          {},
          { text: `${facultyData.workEmail}`, colSpan: 2 },
          {},
          {
            text: "Hold for Pickup",
            colSpan: 2,
            alignment: "center",
            italics: true,
          },
          {},
          {
            svg:
              reimbursementData.paymentRetrievalMethod !== "Hold for Pickup"
                ? `<svg viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="4.5" width="12" height="12" fill="white" stroke="black" stroke-width="1"/></svg>`
                : `<svg viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="4.5" width="12" height="12" fill="white" stroke="black" stroke-width="1"/>
                <path d="M2 9.5L5.5 13L11 6.5" stroke="black" stroke-width="1" fill="none"/>
              </svg>`,
          },
          { text: "Direct Deposit", alignment: "center", colSpan: 2 },
          {},
          {
            svg:
              reimbursementData.paymentRetrievalMethod !== "Direct Deposit"
                ? `<svg viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="4.5" width="12" height="12" fill="white" stroke="black" stroke-width="1"/></svg>`
                : `<svg viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="4.5" width="12" height="12" fill="white" stroke="black" stroke-width="1"/>
            <path d="M2 9.5L5.5 13L11 6.5" stroke="black" stroke-width="1" fill="none"/>
          </svg>`,
          },
        ],
        [
          { text: `${facultyData.mailingAddress}`, colSpan: 3 },
          {},
          {},
          { text: "Phone", colSpan: 2, italics: true },
          {},
          { text: `${facultyData.phoneNumber}`, colSpan: 2 },
          {},
          {
            text: "Check if using UDMPU 11.6 voucher (please attach voucher/log)",
            colSpan: 5,
            rowSpan: 2,
            italics: true,
            alignment: "center",
          },
          {},
          {},
          {},
          {},
          {
            svg:
              String(reimbursementData.UDMPUVoucher) === "false"
                ? `<svg viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="4.5" width="12" height="12" fill="white" stroke="black" stroke-width="1"/></svg>`
                : `<svg viewBox="0 0 13 17" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="4.5" width="12" height="12" fill="white" stroke="black" stroke-width="1"/>
            <path d="M2 9.5L5.5 13L11 6.5" stroke="black" stroke-width="1" fill="none"/>
          </svg>`,
            rowSpan: 2,
          },
        ],
        [
          {
            text: `${facultyData.city}, ${facultyData.state}, ${facultyData.postalCode}`,
            colSpan: 3,
          },
          {},
          {},
          { text: "Department", colSpan: 2, italics: true },
          {},
          { text: `${facultyData.department}`, colSpan: 2 },
          {},
          { text: "", colSpan: 3, italics: true },
          {},
          {},
          { text: "N/A", colSpan: 3 },
          {},
          {},
        ],
        [
          { text: "Reason for Travel/Expense", italics: true, colSpan: 3 },
          {},
          {},
          {
            text: reimbursementData.reimbursementReason,
            colSpan: 10,
            italics: false,
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
        ],
        [
          { text: "Destination-City,State,Country", italics: true, colSpan: 3 },
          {},
          {},
          {
            text: reimbursementData.destination,
            colSpan: 10,
            italics: false,
          },
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
          {},
        ],
      ],
    },
    layout: {
      paddingTop: function (i, node) {
        return 6;
      },
      paddingBottom: function (i, node) {
        return 2;
      },
    },
  });

  content.push({ text: " " }, { text: " " });

  /*
      Expenses Section
  */

  let parsedExpenses = {};

  let pdfExpensesStructure = {
    Lodging: [{ text: "Lodging", fontSize: 10 }],
    Breakfast: [{ text: "Breakfast", fontSize: 10 }],
    Lunch: [{ text: "Lunch", fontSize: 10 }],
    Dinner: [{ text: "Dinner", fontSize: 10 }],
    "Business Guest Meals": [{ text: "Business Guest Meals **", fontSize: 10 }],
    "Air/Train": [{ text: "Air/Train", fontSize: 10 }],
    "Taxi/Bus/Car Rental": [{ text: "Taxi/Bus/Car Rental", fontSize: 10 }],
    Parking: [{ text: "Parking", fontSize: 10 }],
    Registration: [{ text: "Registration", fontSize: 10 }],
    Mileage: [{ text: "Mileage", fontSize: 10 }],
    Other: [],
  };

  let mileageExplanation = [];

  if (expenses.length > 0) {
    expenses.forEach((expense) => {
      if (expense.name === "Mileage") {
        mileageExplanation.push(expense?.additionalInformation || "");
      }

      const expenseDate = parseDate(expense.date);

      /*Populate the object so that the date is the key
      and the expense's  title + cost are the value

      Format:
      parsedExpenses: [
        "11/12/2024": {
            "Lunch": 200
        }
      ]*/

      if (!parsedExpenses[expenseDate]) {
        parsedExpenses[expenseDate] = {}; //Initialize an empty object for a new data
      }

      // If the date already has the same expense, then add the new expense cost to that date
      // For example, if "11/12/2024" has a lunch of 200 and the new expense is on the same day
      // and is also lunch but for $100, it will update the value to have a lunch of 300
      if (parsedExpenses[expenseDate][expense.name]) {
        parsedExpenses[expenseDate][expense.name] += Number(expense.cost) * 100;
      } else {
        parsedExpenses[expenseDate][expense.name] = Number(expense.cost) * 100;
      }
    });
  }

  // Sort expenses by date
  parsedExpenses = Object.fromEntries(
    Object.entries(parsedExpenses).sort(
      ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
    )
  );

  for (let date in parsedExpenses) {
    for (let category in parsedExpenses[date]) {
      parsedExpenses[date][category] /= 100;
    }
  }

  // Since there are only 7 date columns in the PDF, throw an error when
  // the user wants to create a request that spans more than 7 days
  if (Object.keys(parsedExpenses).length > 7) {
    throw new Error(
      "Your reimbursement request expenses have exceeded the maximum dates allowed (Your request expenses span over more than 6 dates)"
    );
  }

  // Create an array of just the dates
  let arrayOfExpensesDates = [];
  for (const key in parsedExpenses) {
    arrayOfExpensesDates.push(key);
  }

  // Creates an array starting with the dates, then padding it with
  // 8 elements if there are than 8
  arrayOfExpensesDates = fillArray(arrayOfExpensesDates, 8);

  // For each date in the parsedExpenses object
  for (const parsedExpensesDate in parsedExpenses) {
    // Loop through each possible expense option
    for (const expenseTitle in pdfExpensesStructure) {
      // If under parsedExpenses, there is an expense under the specific date
      if (parsedExpenses[parsedExpensesDate][expenseTitle]) {
        // In the pdfExpensesStructure, push the cost to the corresponding expense title
        pdfExpensesStructure[expenseTitle].push(
          `$${parsedExpenses[parsedExpensesDate][expenseTitle]}`
        );
      } else {
        // Or else push an empty space, meaning that under this specific date, there was no
        // expense with this title
        pdfExpensesStructure[expenseTitle].push("");
      }
    }
  }

  pdfExpensesStructure.Other = [];

  //Handle Other expenses
  const otherExpenses = expenses.filter((expense) => expense.name === "Other");

  if (otherExpenses.length > 2) {
    throw new Error(
      "Your request exceeds the amount of 'Other' claims. The maximum is 2"
    );
  }

  let otherExpensesStructure = [];

  // When there is no "Other", this makes it so there is still an 'Other' row
  if (otherExpenses.length === 0) {
    let structure = [{ text: "Other (Explain what expense is for)" }];

    structure.push(
      {
        text: "",
        colSpan: 7,
        fontSize: 9,
      },
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    otherExpensesStructure.push(structure);
  }

  otherExpenses.forEach((expense) => {
    let structure = [
      { text: "Other (Explain what expense is for)" },
      {
        text:
          expense.additionalInformation + " (" + parseDate(expense.date) + ")",
        colSpan: 7,
        fontSize: 9,
      },
    ];

    structure.push("", "", "", "", "", "");
    structure.push({ text: "$" + expense.cost, fontSize: 8 });
    otherExpensesStructure.push(structure);
  });

  for (const expense in pdfExpensesStructure) {
    pdfExpensesStructure[expense] = fillArray(pdfExpensesStructure[expense], 8);
  }

  let totalExpenseCosts = {
    Lodging: { cost: 0 },
    Breakfast: { cost: 0 },
    Lunch: { cost: 0 },
    Dinner: { cost: 0 },
    "Business Guest Meals": { cost: 0 },
    "Air/Train": { cost: 0 },
    "Taxi/Bus/Car Rental": { cost: 0 },
    Parking: { cost: 0 },
    Registration: { cost: 0 },
    Mileage: { cost: 0 },
  };

  for (const expenseDate in parsedExpenses) {
    for (const expenseTitle in parsedExpenses[expenseDate]) {
      if (totalExpenseCosts[expenseTitle]) {
        totalExpenseCosts[expenseTitle].cost +=
          parsedExpenses[expenseDate][expenseTitle] * 100;
      }
    }
  }

  // Convert cents back to dollars
  for (let key in totalExpenseCosts) {
    if (totalExpenseCosts[key].hasOwnProperty("cost")) {
      // Ensure 'cost' property exists
      totalExpenseCosts[key].cost /= 100;
    }
  }
  /*
    Expenses section
  */

  content.push({
    table: {
      widths: [160, 40, 40, 40, 40, 40, 40, 40, 40],
      body: [
        [
          { text: "Expenses*", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Date", fillColor: "#d9d9d9" },
          { text: "Total", fillColor: "#d9d9d9" },
        ],
        [
          { text: "All receipts MUST be original", italics: true },
          ...arrayOfExpensesDates,
        ],
        [
          ...pdfExpensesStructure.Lodging,
          {
            text: `$${totalExpenseCosts.Lodging.cost}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfExpensesStructure.Breakfast,
          {
            fontSize: 8,
            text: `$${totalExpenseCosts.Breakfast.cost}`,
          },
        ],
        [
          ...pdfExpensesStructure.Lunch,
          { text: `$${totalExpenseCosts.Lunch.cost}`, fontSize: 8 },
        ],
        [
          ...pdfExpensesStructure.Dinner,
          {
            text: `$${totalExpenseCosts.Dinner.cost}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfExpensesStructure["Business Guest Meals"],
          {
            text: `$${totalExpenseCosts["Business Guest Meals"].cost}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfExpensesStructure["Air/Train"],
          {
            text: `$${totalExpenseCosts["Air/Train"].cost}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfExpensesStructure["Taxi/Bus/Car Rental"],
          {
            text: `$${totalExpenseCosts["Taxi/Bus/Car Rental"].cost}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfExpensesStructure.Parking,
          {
            text: `$${totalExpenseCosts.Parking.cost}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfExpensesStructure.Registration,
          {
            text: `$${totalExpenseCosts.Registration.cost}`,
            fontSize: 8,
          },
        ],
        [
          "Mileage (Include destination)",
          {
            text: mileageExplanation.join(". "),
            colSpan: 7,
            fontSize: 9,
          },
          "",
          "",
          "",
          "",
          "",
          "",
          {
            text: `$${totalExpenseCosts.Mileage.cost}`,
            colSpan: 1,
            fontSize: 8,
          },
        ],
        ...otherExpensesStructure,
      ],
    },
  });

  content.push({ text: " " }, { text: " " });

  //FOAPA Number section
  let foapaDetails = {};
  let foapaArray = [];

  expenses.forEach((expense) => {
    if (foapaDetails[expense.foapaNumber]) {
      foapaDetails[expense.foapaNumber] += Number(expense.cost);
    } else {
      foapaDetails[expense.foapaNumber] = Number(expense.cost);
    }
  });

  console.log(expenses);

  for (const foapa in foapaDetails) {
    console.log(foapa);
    let subFoapaArray = [];
    subFoapaArray = foapa.split("-");

    if (subFoapaArray.length === 4) {
      subFoapaArray[4] = "";
    }
    subFoapaArray[5] = foapaDetails[foapa].toFixed(2);
    foapaArray.push(subFoapaArray);
  }

  // Employee section

  let guestSection = [];
  if (
    !reimbursementData?.guestInformation ||
    reimbursementData?.guestInformation.length == 0
  ) {
    guestSection = [
      [
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
      ],
      [
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
      ],
      [
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
      ],
      [
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
      ],
      [
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
        { text: "", colSpan: 2 },
      ],
    ];
  } else {
    reimbursementData.guestInformation.forEach((guest) => {
      let arr = [];

      arr.push({ text: guest.employeeFirstName, fontSize: 7.5 });
      arr.push({ text: guest.employeeLastName, fontSize: 7.5 });
      arr.push({ text: guest.guestFirstName, fontSize: 7.5 });
      arr.push({ text: guest.guestLastName, fontSize: 7.5 });
      arr.push({ text: guest.guestAssociation, fontSize: 7.5 });
      arr.push("");

      guestSection.push(arr);
    });
  }

  for (let i = 0; i <= 4 - guestSection.length; i++) {
    guestSection.push(["", "", "", "", "", ""]);
  }

  let fullFoapa = [];
  if (reimbursementData?.foapaDetails) {
    for (let i = 0; i < reimbursementData.foapaDetails.length; i++) {
      let foapa = reimbursementData.foapaDetails[i];

      // console.log(foapa);
      // let val = facultyData.foapaDetails.find(
      //   (foap) => foap.foapaName === foapa.foapaName
      // );

      // console.log(val);

      // if (val === undefined) {
      //   break;
      // }

      let val = foapa;
      // console.log(facultyData.foapaDetails);

      console.log(val);
      let details = formatFoapaDetails(val);

      let foapaArray = details.split("-");
      for (let i = 0; i < foapaArray.length; i++) {
        if (foapaArray[i] === "XXXX" || foapaArray[i] === "XXXXXX") {
          foapaArray[i] = "";
        }
      }
      foapaArray.push(foapa.cost);
      fullFoapa.push(foapaArray);
    }
  }

  for (let i = 0; i < 4; i++) {
    if (fullFoapa.length < 4) {
      fullFoapa.push(["", "", "", "", "", ""]);
    }
  }

  content.push({
    columns: [
      {
        width: "65%",
        table: {
          widths: [47, 47, 47, 47, 47, 47],
          heights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          body: [
            [
              { text: "FOAPA", colSpan: 6, alignment: "center" },
              {},
              {},
              {},
              {},
              {},
            ],
            [
              { text: "FUND", alignment: "center", fillColor: "#d9d9d9" },
              { text: "ORG", alignment: "center", fillColor: "#d9d9d9" },
              { text: "ACCT", alignment: "center", fillColor: "#d9d9d9" },
              { text: "PROG", alignment: "center", fillColor: "#d9d9d9" },
              { text: "ACTV", alignment: "center", fillColor: "#d9d9d9" },
              { text: "$", alignment: "center", fillColor: "#d9d9d9" },
            ],
            // FOAPA SECTION
            ...fullFoapa,
            [
              { text: "", colSpan: 6, border: [0, 0, 0, 0] },
              {},
              {},
              {},
              {},
              {},
            ],
            [
              {
                text: "Employee Name",
                alignment: "center",
                fillColor: "#d9d9d9",
                colSpan: 2,
              },
              {},
              {
                text: "**Guest Name",
                alignment: "center",
                fillColor: "#d9d9d9",
                colSpan: 2,
              },
              {},
              {
                text: "Association",
                alignment: "center",
                fillColor: "#d9d9d9",
                colSpan: 2,
              },
              {},
            ],
            ...[...guestSection],
          ],
        },
      },
      {
        width: "35%",
        table: {
          widths: [180],
          heights: [10, 10],
          body: [
            [
              {
                text: [
                  "A. Total Actual Expenses $",
                  {
                    text: String(expenseTotal).padStart(
                      21 - String(expenseTotal).length
                    ),
                    decoration: "underline",
                  },
                ],
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: [
                  "B. Less Advance               ",
                  {
                    text: "".padStart(21),
                    decoration: "underline",
                  },
                ],
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: [
                  "C. Due Employee (A > B)  ",
                  {
                    text: "N/A".padStart(10).padEnd(18),
                    decoration: "underline",
                  },
                ],
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: [
                  "D. Due UDM (B > A)         ",
                  {
                    text: "N/A".padStart(11).padEnd(19),
                    decoration: "underline",
                  },
                ],
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: "Attach Cash Receipt from SAO",
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [{ text: "", border: [false, false, false, false], bold: false }],
            [
              {
                text: "Key",
                decoration: "underline",
                border: [false, false, false, false],
                bold: true,
              },
            ],
            [{ text: "", border: [false, false, false, false] }],
            [
              {
                text: "* Include all supporting documentation and (attach any additional pages if needed)",
                border: [false, false, false, false],
                bold: false,
                fontSize: 8.5,
              },
            ],
            [{ text: "", border: [false, false, false, false] }],
            [
              {
                text: "** Business Guest - Meals per Hospitality Policy (attach any additional pages if needed)",
                border: [false, false, false, false],
                bold: false,
                fontSize: 8.5,
              },
            ],
            [{ text: "", border: [false, false, false, false] }],
            [
              {
                text: "See Sec VI D (Business Guests) Purchasing Employee Reimbursement Policy",
                alignment: "center",
                decoration: "underline",
                color: "#0563c1",
                border: [false, false, false, false],
                bold: false,
                fontSize: 8.5,
              },
            ],
          ],
        },
      },
    ],
    // optional space between columns
    columnGap: 1,
  });

  //   Signature section
  content.push(
    { text: "\n" },
    {
      text: "I hereby certify that this claim is correct and reimbursable",
      bold: false,
      fontSize: 8,
    },
    {
      text: "under published travel expense Policies & Procedures of UDM",
      fontSize: 8,
      bold: false,
    },

    { text: "\n" },

    {
      table: {
        widths: [180, 10, 50, 10, 180, 10, 50],
        heights: [10],
        body: [
          [
            {
              text: `${facultyData.firstName} ${facultyData.lastName}`,
              border: [false, false, false, false],
              italics: true,
              fontSize: 9,
            },
            { text: "", border: [false, false, false, false] },
            {
              text: `${retrieveDate("MM/DD/YYYY")}`,
              border: [false, false, false, true],
              italics: false,
              fontSize: 9,
            },
            { text: "", border: [false, false, false, false] },
            {
              text: "",
              border: [false, false, false, false],
              italics: false,
              fontSize: 9,
            },
            { text: "", border: [false, false, false, false] },
            {
              text: "",
              border: [false, false, false, false],
              italics: false,
              fontSize: 9,
            },
          ],
        ],
      },
    },
    {
      table: {
        widths: [180, 10, 50, 10, 180, 10, 50],
        heights: [10],
        body: [
          [
            {
              text: `Signature of Employee`,
              border: [false, true, false, false],
              italics: false,
              fontSize: 9,
            },

            { text: "", border: [false, false, false, false] },
            {
              text: `Date`,
              border: [false, false, false, false],
              italics: false,
              fontSize: 9,
            },
            { text: "", border: [false, false, false, false] },
            {
              text: "Director/Manager/Dean/VP/President",
              border: [false, true, false, false],
              italics: false,
              fontSize: 9,
            },
            { text: "", border: [false, false, false, false] },
            {
              text: "Date",
              border: [false, true, false, false],
              italics: false,
              fontSize: 9,
            },
          ],
        ],
      },
    },
    { text: "\n" },
    {
      text: "Budget ____________  A/P ___________  Audit ___________",
      fontSize: 9,
    }
  );

  // Add all the images
  receiptData.forEach((receipt) => {
    content.push({
      image: receipt,
      fit: [550, 550],
    });
  });

  return content;
}
