function parseDate(dateString) {
  if (!dateString) return
  const formattedDate = dateString.slice(0, 10);
  return formattedDate;
}

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

function combineOtherField(data) {
  let parsedField = [
    {
      text: "",
      colSpan: 7,
      fontSize: 9,
    },
  ];

  data.forEach((activity) => {
    activity.text != "" ? (parsedField[0].text += activity.text + ". ") : "";
  });

  return parsedField;
}

export default function createPdfDefinition(
  reimbursementData,
  userInfo,
  allImageIds
) {
  // console.log("DATA", reimbursementData);
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;
  // console.log("generate pdf", userInfo);
  // console.log(reimbursementData, userInfo);

  const { activities } = reimbursementData;
  let content = [];

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
      text: `Date Submitted:   ${formattedToday}\n\n`,
      italics: true,
      decoration: "underline",
    }
  );

  //   Faculty information section
  let ticketTotal = 0;

  console.log("Reimbursement data", reimbursementData)
  if (reimbursementData?.activities) {
    reimbursementData.activities.forEach((activity) => {
      ticketTotal += Number(activity.cost);
    });
  }

  ticketTotal = ticketTotal.toFixed(2);
  content.push({
    table: {
      //13
      widths: [50, 40, 40, 40, 40, 40, 40, 20, 20, 40, 20, 20, 33],
      height: 0,
      headerRows: 1,
      // keepWithHeaderRows: 1,
      body: [
        [
          { text: "Name & Home Mailing Address", italics: true, colSpan: 3 },
          {},
          {},
          { text: "Employee #", colSpan: 2, italics: true },
          {},
          { text: `${userInfo.employmentNumber}`, colSpan: 2 },
          {},
          { text: "Reimbursement", colSpan: 3, italics: true },
          {},
          {},
          { text: "$" + `${ticketTotal}`, colSpan: 3 },
          {},
          {},
        ],
        [
          { text: `${userInfo.firstName} ${userInfo.lastName}`, colSpan: 3 },
          {},
          {},
          { text: "Email", colSpan: 2, italics: true },
          {},
          { text: `${userInfo.workEmail}`, colSpan: 2 },
          {},
          // HERE
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
          { text: `${userInfo.mailingAddress}`, colSpan: 3 },
          {},
          {},
          { text: "Phone", colSpan: 2, italics: true },
          {},
          { text: `${userInfo.phoneNumber}`, colSpan: 2 },
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
              reimbursementData.UDMPUVoucher === "false"
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
            text: `${userInfo.city}, ${userInfo.state}, ${userInfo.postalCode}`,
            colSpan: 3,
          },
          {},
          {},
          { text: "Department", colSpan: 2, italics: true },
          {},
          { text: `${userInfo.department}`, colSpan: 2 },
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
        //return (i === node.table.widths.length - 1) ? 5 : 5;
      },
      paddingBottom: function (i, node) {
        return 2;
        //return (i === node.table.widths.length - 1) ? 5 : 5;
      },
    },
  });

  //Divider
  content.push({ text: " " }, { text: " " });

  //Calculate activities section
  let parsedActivity = {};
  let pdfStructure = {
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
  //Calculating all the costs based on activity based ond date

  if (activities) {

    activities.forEach((activity) => {
      if (activity.activityName === "Mileage") {
        mileageExplanation.push(activity?.additionalInformation || "");
      }
      let activityDate = parseDate(activity.date);
      if (!parsedActivity[activityDate]) {
        parsedActivity[activityDate] = {};
      }

      if (!parsedActivity[activityDate][activity.name]) {
        parsedActivity[activityDate][activity.name] = Number(
          activity.cost
        );
      } else {
        parsedActivity[activityDate][activity.name] += Number(
          activity.cost
        );
      }
    });
  }

  parsedActivity = Object.fromEntries(
    Object.entries(parsedActivity).sort(
      ([dateA], [dateB]) => new Date(dateA) - new Date(dateB)
    )
  );

  if (Object.keys(parsedActivity).length > 7) {
    console.log("Should be throwing an error");
  }

  let datesArray = [];
  for (const key in parsedActivity) {
    datesArray.push(key);
  }

  datesArray = fillArray(datesArray, 8);
  console.log(parsedActivity);
  for (const parsedActivityDate in parsedActivity) {
    for (const expenseTitle in pdfStructure) {
      if (parsedActivity[parsedActivityDate][expenseTitle]) {
        pdfStructure[expenseTitle].push(
          `$${parsedActivity[parsedActivityDate][expenseTitle]}`
        );
      } else {
        pdfStructure[expenseTitle].push("");
      }
    }
  }

  pdfStructure.Other = pdfStructure.Other.filter((val) => val != "");

  for (const parsedActivityDate in parsedActivity) {
    for (const activity in parsedActivity[parsedActivityDate]) {
      if (!pdfStructure[activity]) {
        pdfStructure.Other.push(activity);
      }
    }
  }

  for (const activity in pdfStructure) {
    pdfStructure[activity] = fillArray(pdfStructure[activity], 8);
  }

  let totalActivityCosts = {
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
    Other: { cost: 0 },
  };

  for (const activityDate in parsedActivity) {
    for (const activityName in parsedActivity[activityDate]) {
      if (totalActivityCosts[activityName]) {
        totalActivityCosts[activityName].cost +=
          parsedActivity[activityDate][activityName];
      } else {
        totalActivityCosts.Other.cost +=
          parsedActivity[activityDate][activityName];
      }
    }
  }
  console.log("costs", totalActivityCosts);
  console.log(pdfStructure);

  //Expenses section
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
          ...datesArray,
        ],
        [
          ...pdfStructure.Lodging,
          {
            text: `$${totalActivityCosts.Lodging.cost.toFixed(2)}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfStructure.Breakfast,
          {
            fontSize: 8,
            text: `$${totalActivityCosts.Breakfast.cost.toFixed(2)}`,
          },
        ],
        [
          ...pdfStructure.Lunch,
          { text: `$${totalActivityCosts.Lunch.cost.toFixed(2)}`, fontSize: 8 },
        ],
        [
          ...pdfStructure.Dinner,
          {
            text: `$${totalActivityCosts.Dinner.cost.toFixed(2)}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfStructure["Business Guest Meals"],
          {
            text: `$${totalActivityCosts["Business Guest Meals"].cost.toFixed(
              2
            )}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfStructure["Air/Train"],
          {
            text: `$${totalActivityCosts["Air/Train"].cost.toFixed(2)}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfStructure["Taxi/Bus/Car Rental"],
          {
            text: `$${totalActivityCosts["Taxi/Bus/Car Rental"].cost.toFixed(
              2
            )}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfStructure.Parking,
          {
            text: `$${totalActivityCosts.Parking.cost.toFixed(2)}`,
            fontSize: 8,
          },
        ],
        [
          ...pdfStructure.Registration,
          {
            text: `$${totalActivityCosts.Registration.cost.toFixed(2)}`,
            fontSize: 8,
          },
        ],
        // [, ...pdfStructure.Mileage, "0.00"],
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
            text: `$${totalActivityCosts.Mileage.cost.toFixed(2)}`,
            colSpan: 1,
            fontSize: 8,
          },
        ],
        // activitiesClassification["Mileage"].finalData,
        // ["Other (Explain what expense is for )", ...pdfStructure.Other],
        [
          "Other (Explain what expense is for )",
          ...combineOtherField(pdfStructure.Other),
          "",
          "",
          "",
          "",
          "",
          "",
          {
            text: `$${totalActivityCosts.Other.cost.toFixed(2)}`,
            colSpan: 1,
            fontSize: 8,
          },
        ],
      ],
    },
  });

  content.push({ text: " " }, { text: " " });
  //Columns

  //FOAPA Number section
  let foapaDetails = {};
  let foapaArray = [];

  if (reimbursementData?.activities) {

    reimbursementData.activities.forEach((activity) => {
      if (foapaDetails[activity.foapaNumber]) {
        foapaDetails[activity.foapaNumber] += Number(activity.cost);
      } else {
        foapaDetails[activity.foapaNumber] = Number(activity.cost);
      }
    });
  }

  for (const foapa in foapaDetails) {
    let subFoapaArray = [];
    subFoapaArray = foapa.split("-");
    if (subFoapaArray.length === 4) {
      subFoapaArray[4] = "";
    }
    subFoapaArray[5] = foapaDetails[foapa].toFixed(2);
    foapaArray.push(subFoapaArray);
  }

  console.log(foapaArray)
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
              //TODO: HERE
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
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
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
            [`jack`, `bower`, `briggs`, `bob`, `stepson`, ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
            ["", "", "", "", "", ""],
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
                  { text: `${ticketTotal}`, decoration: "underline" },
                ],
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: "B. Less advance __________",
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: "C. Due Employee (A > B) _N/A_______",
                border: [false, false, false, false],
                bold: false,
              },
            ],
            [
              {
                text: "D. Due UDM (B > A) _N/A__________",
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

    { text: "\n\n" },

    {
      table: {
        widths: [180, 10, 50, 10, 180, 10, 50],
        heights: [10],
        body: [
          [
            {
              text: `${userInfo.firstName} ${userInfo.lastName}`,
              border: [false, false, false, false],
              italics: false,
              fontSize: 9,
            },
            // {
            //   text: "Signature of Employee",
            //   border: [false, true, false, false],
            //   italics: false,
            //   fontSize: 9,
            // },
            { text: "", border: [false, false, false, false] },
            {
              text: `${formattedToday}`,
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

  allImageIds.forEach((imgid) => {
    content.push({
      image: imgid,
      fit: [550, 550],
    });
  });
  return content;
}
