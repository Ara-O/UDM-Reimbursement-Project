function parseDate(dateString) {
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

export default function createPdfDefinition(
  reimbursementData,
  userInfo,
  allImageIds
) {
  console.log("DATA", reimbursementData);
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
  reimbursementData.activities.forEach((activity) => {
    ticketTotal += Number(activity.amount);
  });
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
            text: reimbursementData.expenseReason,
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
            text: reimbursementData.destinationLocation,
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

  let activitiesClassification = {
    Lodging: {
      dates: [],
      total: 0,
      finalData: [],
    },
    Breakfast: {
      dates: [],
      total: 0,
      finalData: [],
    },
    Lunch: {
      dates: [],
      total: 0,
      finalData: [],
    },
    Dinner: {
      dates: [],
      total: 0,
      finalData: [],
    },
    "Business Guest Meals": {
      dates: [],
      total: 0,
      finalData: [],
    },
    "Air/Train": {
      dates: [],
      total: 0,
      finalData: [],
    },
    "Taxi/Bus/Car Rental": {
      dates: [],
      total: 0,
      finalData: [],
    },
    Parking: {
      dates: [],
      total: 0,
      finalData: [],
    },
    Registration: {
      dates: [],
      total: 0,
      finalData: [],
    },
    Mileage: {
      explanation: "",
      total: 0,
      finalData: [],
    },
    Other: {
      explanation: "",
      total: 0,
      finalData: [],
    },
  };

  activities.forEach((activity) => {
    let arrayField = activitiesClassification[`${activity.activityName}`];

    if (arrayField === undefined) {
      arrayField = activitiesClassification[`Other`];
      arrayField.explanation += activity.activityName + ". ";
    } else if (activity.activityName === "Mileage") {
      arrayField.explanation += "Something goes here i spos";
    } else {
      arrayField.dates.push({
        text: parseDate(activity.activityDate),
        fontSize: 7.5,
      });
    }
    arrayField.total += Number(activity.amount);
  });

  //Put data in right format
  for (const property in activitiesClassification) {
    if (property !== "Other" && property !== "Mileage") {
      activitiesClassification[property].finalData = [
        property,
        ...activitiesClassification[property].dates,
      ];
    }

    for (let i = 0; i < 9; i++) {
      if (activitiesClassification[property].finalData[i] === undefined) {
        activitiesClassification[property].finalData[i] = "";
      }

      activitiesClassification[property].finalData[8] = {
        text: `$ ${activitiesClassification[property].total}`,
        fontSize: 7.5,
      };
    }
  }

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
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        activitiesClassification["Lodging"].finalData,
        // ["Lodging", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Breakfast"].finalData,
        // ["Breakfast", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Lunch"].finalData,
        // ["Lunch", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Dinner"].finalData,
        // ["Dinner", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Business Guest Meals"].finalData,
        // ["Business Guest Meals **", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Air/Train"].finalData,
        // ["Air/Train", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Taxi/Bus/Car Rental"].finalData,
        // ["Taxi/Bus/Car Rental", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Parking"].finalData,
        // ["Parking", "", "", "", "", "", "", "", "0.00"],
        activitiesClassification["Registration"].finalData,
        // ["Registration", "", "", "", "", "", "", "", "0.00"],
        [
          "Mileage (Include destination)",
          {
            text: activitiesClassification["Mileage"].explanation,
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
            text: `$${activitiesClassification["Mileage"].total}`,
            colSpan: 1,
            fontSize: 7.5,
          },
        ],
        // activitiesClassification["Mileage"].finalData,
        [
          "Other (Explain what expense is for )",
          {
            text: activitiesClassification["Other"].explanation,
            colSpan: 7,
            fontSize: 7.5,
          },
          "",
          "",
          "",
          "",
          "",
          "",
          {
            text: `$ ${activitiesClassification["Other"].total}`,
            colSpan: 1,
            fontSize: 7.5,
          },
        ],
        [
          "Other (Explain what expense is for )",
          { text: "", colSpan: 7 },
          "",
          "",
          "",
          "",
          "",
          "",
          { text: "", colSpan: 1 },
        ],
      ],
    },
  });

  content.push({ text: " " }, { text: " " });
  //Columns

  //FOAPA Number section
  let foapaDetails = {};
  let foapaArray = [];
  reimbursementData.activities.forEach((activity) => {
    if (foapaDetails[activity.foapaNumber]) {
      foapaDetails[activity.foapaNumber] += Number(activity.amount);
    } else {
      foapaDetails[activity.foapaNumber] = Number(activity.amount);
    }
  });

  for (const foapa in foapaDetails) {
    let subFoapaArray = [];
    subFoapaArray = foapa.split("-");
    if (subFoapaArray.length === 4) {
      subFoapaArray[4] = "";
    }
    subFoapaArray[5] = foapaDetails[foapa];
    foapaArray.push(subFoapaArray);
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
            foapaArray[0] || ["", "", "", "", "", ""],
            foapaArray[1] || ["", "", "", "", "", ""],
            foapaArray[2] || ["", "", "", "", "", ""],
            foapaArray[3] || ["", "", "", "", "", ""],
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
            ["", "", "", "", "", ""],
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
              border: [false, false, false, true],
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
