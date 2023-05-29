<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3 style="margin-top: 0px" class="all-activities-text">
        All Activities
      </h3>
      <span class="activities-list">
        <div class="activity" v-for="activity in allActivities">
          <h3>{{ activity.activityName }}</h3>
          <h4>
            Date: {{ parseDate(activity.activityDate) }} || Cost:
            {{ activity.amount }}
          </h4>
          <h4>Foapa Number: {{ activity.foapaNumber }}</h4>
          <div
            class="delete-option"
            @click="deleteActivity(activity.activityId)"
          >
            <img
              src="../assets/trash-icon-white.png"
              alt="Trash icon"
              class="trash-icon"
            />
          </div>
          <div @click="editActivity(activity.activityId)">
            <img
              src="../assets/edit-icon.png"
              class="edit-icon-button"
              alt="Edit icon"
            />
          </div>
        </div>
      </span>
      <div class="cta-buttons">
        <button class="add-actvities-button" @click="createPdf">
          Submit Ticket
        </button>
        <button class="add-actvities-button" @click="saveReimbursement">
          Save Ticket
        </button>
        <button class="add-actvities-button" @click="createPdf">
          Preview Ticket
        </button>
        <button class="add-actvities-button" @click="goToHomePage">
          Discard
        </button>
        <h5
          style="font-weight: 400; margin-top: 2px"
          v-show="currentlyAddingPDF"
        >
          Attaching with ticket, please wait ...
        </h5>
      </div>
    </section>
    <section class="reimbursement-section">
      <div class="reimbursement-title">
        <input
          class="reimbursement-title-text"
          v-model="reimbursementTitle"
          placeholder="Reimbursement Title"
        />
        <img
          src="../assets/edit-icon.png"
          class="edit-icon-button"
          alt="Edit icon"
        />
      </div>

      <div style="display: flex; align-items: center; gap: 20px; height: auto">
        <img
          src="../assets/user-help-icon.png"
          alt="Help icon"
          class="help-icon"
        />
        <h4 style="font-weight: 300; font-size: 14px; margin: 0px">
          Choose from one of the default options below or select other to create
          another type of expense
        </h4>
      </div>
      <h4 style="font-weight: 500">Expenses</h4>
      <div class="expenses-section">
        <input
          list="defaults"
          name="defaultOptions"
          v-model="chosenExpense"
          class="input-field"
        />

        <datalist id="defaults">
          <option :value="expense" v-for="expense in expensesDefaults">
            {{ expense }}
          </option>
        </datalist>
      </div>
      <br />
      <div class="cost-and-other-section">
        <br />
        <span>
          <h3>Cost:</h3>
          <input
            v-model="expenseCost"
            type="number"
            placeholder="$ Cost"
            min="0"
            class="input-field"
          />
        </span>
      </div>
      <br />
      <div class="foapa-and-date-section">
        <div>
          <h3>FOAPA Number to use:</h3>
          <select
            placeholder="Select FOAPA to pay for activity with"
            class="input-field"
            v-model="foapaNumber"
          >
            <option
              :value="foapaNumber.foapaNumber"
              v-for="foapaNumber in userFoapaNumbers"
            >
              {{ foapaNumber.foapaName + ":\t" + foapaNumber.foapaNumber }}
            </option>
          </select>
        </div>

        <div>
          <h3>Date Of Activity:</h3>
          <input
            type="date"
            v-model="activityDate"
            placeholder="Date of Activity"
            class="input-field"
          />
        </div>
      </div>
      <h3
        v-if="selectedFoapaAmount"
        style="
          margin-bottom: -15px;
          font-weight: 500;
          font-size: 13px;
          margin-top: 27px;
        "
      >
        The Selected FOAPA has ${{ selectedFoapaAmount }}
      </h3>
      <div class="add-receipt">
        <div class="add-receipt-text">Add Receipt:</div>
        <input
          type="file"
          id="avatar"
          ref="receiptRef"
          name="avatar"
          accept="image/png, image/jpeg"
          multiple
        />
      </div>

      <h5 class="terms-and-conditions">
        By adding an activity; I hereby certify that this claim is correct and
        reimbursable under published travel expense Policies & Procedures of UDM
      </h5>
      <br />
      <button
        class="add-reimbursement-button"
        @click="addActivity"
        :disabled="currentlyAddingActivity"
      >
        Add Activity
      </button>
      <h5 style="font-weight: 400" v-show="currentlyAddingActivity">
        Adding activity, please wait...
      </h5>
    </section>
    <!-- <section class="user-foapa-info-section">
      <div><h3>Foapa Details</h3></div>
      <div v-for="foapa in userFoapaNumbers">
        <h3>{{ foapa.foapaName }}</h3>
        <h3>{{ foapa.foapaNumber }}</h3>
        <h3>Remaining Amount: {{ foapa.currentAmount }}</h3>
      </div>
    </section> -->
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios, { all } from "axios";

const receiptRef = ref(null);
const router = useRouter();
const route = useRoute();
type Activity = {
  activityId: number;
  activityName: string;
  amount: number;
  foapaNumber: string;
  activityDate: string;
  activityReceipt: string;
};

type FoapaNumbers = {
  employmentNumber: number;
  foapaNumber: string;
  foapaName: string;
  currentAmount: number;
  initialAmount: number;
};

let chosenExpense = ref<string>("");
let chosenExpenseOther = ref<string>("");
let expenseCost = ref<number>(0);
let activityDate = ref<string>("");
let foapaNumber = ref<string>("");
let reimbursementTitle = ref<string>("");
let userIsEditingReimbursement = ref<boolean>(false);
let allActivities = ref<Array<Activity>>([]);
let reimbursementDataFromDb = ref<any>({});
let currentlyAddingActivity = ref<boolean>(false);
let currentlyAddingPDF = ref<boolean>(false);
let userFoapaNumbers = ref<FoapaNumbers[]>([]);

watch(chosenExpenseOther, (newVal) => {
  if (newVal.length >= 0) {
    chosenExpense.value = chosenExpenseOther.value;
  }
});

let selectedFoapaAmount = ref<number>();
watch(foapaNumber, () => {
  console.log(foapaNumber.value);

  let selectedFoapa = userFoapaNumbers.value.filter(
    (foapa) => foapa.foapaNumber == foapaNumber.value
  );

  console.log("sel", selectedFoapa);
  if (selectedFoapa.length > 0) {
    selectedFoapaAmount.value = selectedFoapa[0].currentAmount;
  }
});

const expensesDefaults = [
  "Air/Train",
  "Breakfast",
  "Business Guest Meals",
  "Dinner",
  "Lodging",
  "Lunch",
  "Mileage",
  "Other",
  "Parking",
  "Registration",
  "Taxi/Bus/Car Rental",
];

function goToHomePage() {
  router.push("/dashboard");
}

async function storeActivityImage() {
  let formData = new FormData();

  //@ts-ignore
  const files = receiptRef.value.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append("receipts", file);
  }

  if (files.length > 0) {
    try {
      // Send the FormData object to the server using axios
      let res = await axios.post(
        "https://reimbursement-project.onrender.com/api/storeActivityImages",
        formData
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  } else {
    return "";
  }
}

async function addActivity() {
  if (expenseCost.value > (selectedFoapaAmount.value ?? 0)) {
    alert("Warning: Activity cost exceeds the selected FOAPA's current amount");
  }
  if (chosenExpense.value === "Other") {
    alert("Please type in description of 'Other' expense.");
  } else if (
    chosenExpense.value !== "" &&
    expenseCost.value !== 0 &&
    foapaNumber.value !== "" &&
    activityDate.value !== ""
  ) {
    currentlyAddingActivity.value = true;
    let storedImagesURL = await storeActivityImage();
    //TODO: Delete acivity image when they delete an activity
    allActivities.value.push({
      activityName: chosenExpense.value,
      amount: expenseCost.value,
      foapaNumber: foapaNumber.value,
      activityDate: activityDate.value,
      activityId: Number(generateRandomId()),
      activityReceipt: storedImagesURL,
    });

    chosenExpense.value = foapaNumber.value = activityDate.value = "";
    expenseCost.value = 0;
    currentlyAddingActivity.value = false;
  } else {
    alert("Missing field, please check to make sure all fields are filled");
  }
}

function retrieveFoapaDetails() {
  axios
    .get(`https://reimbursement-project.onrender.com/api/retrieveFoapaDetails`)
    .then((res) => {
      userFoapaNumbers.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function retrieveActivity() {
  axios
    .get(`http://localhost:8080/api/retrieveActivity`)
    .then((res) => {
      console.log(res)
      allActivities.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function reverseParseDate(formattedDate: string) {
  const year = formattedDate.slice(0, 4);
  const month = formattedDate.slice(5, 7);
  const day = formattedDate.slice(8, 10);

  const originalDateString = `${year}-${month}-${day}`;

  return originalDateString;
}



function editActivity(activityId: number) {
  const activity = allActivities.value.find((activity) => activity.activityId === activityId);
  console.log(activity)

  if (activity) {
    expenseCost.value = activity.amount
    chosenExpense.value = activity.activityName;
    foapaNumber.value = activity.foapaNumber;
    activityDate.value = reverseParseDate(activity.activityDate);
    activityId = activity.activityId
    // Do image receipt as well here ...
  }
  // axios
  //   .post(
  //     "http://localhost:8080/api/editActivity",
  //     {
  //       activity,
  //     }
  //   )
  //   .then(() => {
  //     retrieveActivity();
  //     alert("Activity Updated Successfully");
  //   });
}

function generateRandomId(): string {
  const chars: string = "1234567890";
  let result: string = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function parseDate(dateString: string) {
  const dateParsed = new Date(dateString);
  const formattedDate = dateParsed.toISOString().slice(0, 10);
  return formattedDate;
}

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  allActivities.value.forEach((activity) => {
    sum += Number(activity.amount);
  });
  return sum;
}

function deleteActivity(activityId: number) {
  allActivities.value = allActivities.value.filter(
    (activity) => activity.activityId != activityId
  );
}

let reimbursementData = {};

async function saveReimbursement() {
  if (userIsEditingReimbursement.value === true) {
    reimbursementDataFromDb.value.reimbursementDate = new Date().toISOString();
    allActivities.value.forEach((activity) => {
      activity.activityDate = parseDate(activity.activityDate);
    });
    reimbursementDataFromDb.value.allActivities = allActivities.value;
    reimbursementDataFromDb.value.totalAmount = getAllActivitiesAmount();
    reimbursementDataFromDb.value.eventName = reimbursementTitle.value;

    let updatingReimbursement = await axios.post(
      "https://reimbursement-project.onrender.com/api/updateReimbursement",
      reimbursementDataFromDb.value
    );
    alert("Reimbursement ticket saved successfully");
    router.push("/dashboard");
  } else {
    let randomId: string = generateRandomId();
    reimbursementData = {
      reimbursementId: Number(randomId),
      eventName: reimbursementTitle.value,
      totalAmount: getAllActivitiesAmount(),
      reimbursementStatus: 0,
      reimbursementDate: new Date().toISOString(),
      allActivities: allActivities.value,
    };

    axios
      .post(
        "https://reimbursement-project.onrender.com/api/addReimbursement",
        reimbursementData
      )
      .then((res) => {
        console.log(res);
        router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
    alert("Reimbursement saved successfully");
  }
}

function downloadPDF(pdfData: string) {
  const linkSource = pdfData;
  // const downloadLink = document.createElement("a");
  // const fileName = "reimbursement.pdf";
  // downloadLink.href = linkSource;
  // downloadLink.setAttribute("target", "_blank")
  // downloadLink.click();

  let iframe =
    "<iframe width='100%' height='100%' src='" + linkSource + "'></iframe>";
  let x = window.open();
  if (x != null) {
    x.document.open();
    x.document.write(iframe);
    x.document.close();

    // Remove padding from the iframe content
    x.document.querySelector("style") ||
    x.document.head.appendChild(x.document.createElement("style"));
    // @ts-ignore
    x.document.querySelector("style").textContent += `
  body, iframe {
    margin: 0;
    padding: 0;
    overflow: hidden
  }
`;
  }
}

function previewPDF(pdfData: string) {
  // TODO: Preview PDF
}

function createPdf() {
  currentlyAddingPDF.value = true;
  //Send user information

  for (let i = 0; i < allActivities.value.length; i++) {
    if (allActivities.value[i].activityReceipt === "") {
      alert("Warning: An activity without a receipt was added");
      break;
    }
  }

  axios
    .get(
      `https://reimbursement-project.onrender.com/api/retrieveAccountInformation`
    )
    .then((response) => {
      if (userIsEditingReimbursement.value === true) {
        reimbursementDataFromDb.value.reimbursementDate =
          new Date().toISOString();
        allActivities.value.forEach((activity) => {
          activity.activityDate = parseDate(activity.activityDate);
        });
        reimbursementDataFromDb.value.allActivities = allActivities.value;
        reimbursementDataFromDb.value.totalAmount = getAllActivitiesAmount();
        reimbursementDataFromDb.value.eventName = reimbursementTitle.value;
        axios
          .get("https://reimbursement-project.onrender.com/api/generatePdf", {
            params: {
              reimbursementData: reimbursementDataFromDb.value,
              userInfo: response.data,
            },
          })
          .then((res) => {
            downloadPDF(res.data);
            currentlyAddingPDF.value = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let randomId: string = generateRandomId();
        reimbursementData = {
          reimbursementId: Number(randomId),
          eventName: reimbursementTitle.value,
          totalAmount: getAllActivitiesAmount(),
          reimbursementStatus: 0,
          reimbursementDate: new Date().toISOString(),
          allActivities: allActivities.value,
        };
        axios
          .get("https://reimbursement-project.onrender.com/api/generatePdf", {
            params: {
              reimbursementData: reimbursementData,
              userInfo: response.data,
            },
          })
          .then((res) => {
            downloadPDF(res.data);
            currentlyAddingPDF.value = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(() => {
  console.log(route.query.reimbursementId);
  if (route.query.reimbursementId) {
    userIsEditingReimbursement.value = true;
    axios
      .get(
        "https://reimbursement-project.onrender.com/api/retrieveTicketInformation",
        {
          params: {
            reimbursementId: route.query.reimbursementId,
          },
        }
      )
      .then((res) => {
        // reimbursementDataFromDb.value = res.data;
        reimbursementTitle.value = res.data.eventName;
        allActivities.value = res.data.activities;
        reimbursementDataFromDb.value.reimbursementId =
          res.data.reimbursementId;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  retrieveFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
