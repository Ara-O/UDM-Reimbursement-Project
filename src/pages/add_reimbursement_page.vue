<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3>All Activities</h3>
      <div class="activity" v-for="activity in allActivities">
        <h3>{{ activity.activityName }}</h3>
        <h4>
          Date: {{ parseDate(activity.activityDate) }} || Cost:
          {{ activity.amount }}
        </h4>
        <h4>Foapa Number: {{ activity.foapaNumber }}</h4>
        <div class="delete-option" @click="deleteActivity(activity.activityId)">
          <img
            src="../assets/trash-icon-white.png"
            alt="Trash icon"
            class="trash-icon"
          />
        </div>
      </div>
      <div class="cta-buttons">
        <button class="go-back-button" @click="goToHomePage">Go Back</button>
        <button class="go-back-button" @click="saveReimbursement">
          Save for Later
        </button>
        <button class="go-back-button" @click="createPdf">Export to PDF</button>
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
      <div style="display: flex; align-items: center; gap: 20px; height: 20px">
        <img
          src="../assets/user-help-icon.png"
          alt="Help icon"
          class="help-icon"
        />
        <h4 style="font-weight: 300; font-size: 14px">
          Choose from one of the default options below or select other to create
          another type of expense
        </h4>
      </div>
      <br />
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
      <h3 class="selected-option">
        <span style="font-weight: 500"> Selected - </span>
        <span style="font-weight: 400"> {{ chosenExpense }}</span>
      </h3>
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
              v-for="foapaNumber in foapaNumbersToSelectFrom"
            >
              {{ foapaNumber.foapaNumber }}
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
      <button class="add-reimbursement-button" @click="addActivity">
        Add Activity
      </button>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

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

function goToHomePage() {
  router.push("/dashboard");
}

let chosenExpense = ref<string>("");
let chosenExpenseOther = ref<string>("");
let expenseCost = ref<number>(0);
let activityDate = ref<string>("");
let foapaNumber = ref<string>("");
let reimbursementTitle = ref<string>("");
let userIsEditingReimbursement = ref<boolean>(false);
let allActivities = ref<Array<Activity>>([]);
let reimbursementDataFromDb = ref<any>([]);

watch(chosenExpenseOther, (newVal) => {
  if (newVal.length >= 0) {
    chosenExpense.value = chosenExpenseOther.value;
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

let foapaNumbersToSelectFrom = ref([
  {
    foapaNumber: "100-100",
    employmentNumber: 201,
  },
  {
    foapaNumber: "johny",
    employmentNumber: 201,
  },
  {
    foapaNumber: "busy",
    employmentNumber: 201,
  },
]);

async function addActivity() {
  let storedImages = await storeActivityImage();
  //TODO: Delete acivity image when they delete an activity
  allActivities.value.push({
    activityName: chosenExpense.value,
    amount: expenseCost.value,
    foapaNumber: foapaNumber.value,
    activityDate: activityDate.value,
    activityId: Number(generateRandomId()),
    activityReceipt: storedImages,
  });

  console.log(allActivities.value);
  chosenExpense.value = foapaNumber.value = activityDate.value = "";
  expenseCost.value = 0;
}

const storedEmploymentNumber = localStorage.getItem("employmentNumber");

function retrieveFoapaNumbers() {
  const storedEmploymentNumber = localStorage.getItem("employmentNumber");
  axios
    .get(`/api/retrieveFoapaNumbers`, {
      params: { employmentNumber: storedEmploymentNumber },
    })
    .then((res) => {
      foapaNumbersToSelectFrom.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
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
  const dateObj = new Date(dateString);
  const formattedDate = dateObj.toISOString().slice(0, 10);
  return formattedDate;
}

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  allActivities.value.forEach((activity) => {
    sum += Number(activity.amount);
  });

  return sum;
}

function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // add 1 because getMonth() returns 0-11
  const day = today.getDate();
  const formattedDate = `${year}-${month < 10 ? "0" + month : month}-${
    day < 10 ? "0" + day : day
  }`;

  return formattedDate;
}

function deleteActivity(activityId: number) {
  allActivities.value = allActivities.value.filter(
    (activity) => activity.activityId != activityId
  );
}
let reimbursementData = {};

async function storeActivityImage() {
  // FORM DATA
  const formData = new FormData();

  // Get the file inputs
  //@ts-ignore
  const files = receiptRef.value.files;
  console.log(files);
  for (let i = 0; i < files.length; i++) {
    console.log(files);
    formData.append("receipt-images", files[i]);
  }

  try {
    // Send the FormData object to the server using axios
    let res = await axios.post("/profile-upload-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type header
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

async function saveReimbursement() {
  if (userIsEditingReimbursement.value === true) {
    reimbursementDataFromDb.value.reimbursementDate = getCurrentDate();
    allActivities.value.forEach((activity) => {
      activity.activityDate = parseDate(activity.activityDate);
    });
    reimbursementDataFromDb.value.allActivities = allActivities.value;
    reimbursementDataFromDb.value.totalAmount = getAllActivitiesAmount();
    reimbursementDataFromDb.value.eventName = reimbursementTitle.value;
    console.log(reimbursementDataFromDb.value);

    let updatingReimbursement = await axios.post(
      "/api/updateReimbursement",
      reimbursementDataFromDb.value
    );
    // .then((res) => {
    //   console.log(res);
    // })
    // .catch((err) => {
    //   console.log(err);
    // });
    console.log(updatingReimbursement);
    alert("Reimbursement saved successfully");
  } else {
    let randomId: string = generateRandomId();
    reimbursementData = {
      reimbursementId: Number(randomId),
      employmentNumber: storedEmploymentNumber,
      eventName: reimbursementTitle.value,
      totalAmount: getAllActivitiesAmount(),
      reimbursementStatus: 0,
      reimbursementDate: getCurrentDate(),
      allActivities: allActivities.value,
    };

    axios
      .post("/api/addReimbursement", reimbursementData)
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
  const downloadLink = document.createElement("a");
  const fileName = "reimbursement.pdf";
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}

function createPdf() {
  //Send user information
  const storedEmploymentNumber = localStorage.getItem("employmentNumber");
  axios
    .get(`/api/retrieveAccountInfo`, {
      params: { employmentNumber: storedEmploymentNumber },
    })
    .then((response) => {
      if (userIsEditingReimbursement.value === true) {
        reimbursementDataFromDb.value.reimbursementDate = getCurrentDate();
        allActivities.value.forEach((activity) => {
          activity.activityDate = parseDate(activity.activityDate);
        });
        reimbursementDataFromDb.value.allActivities = allActivities.value;
        reimbursementDataFromDb.value.totalAmount = getAllActivitiesAmount();
        reimbursementDataFromDb.value.eventName = reimbursementTitle.value;
        axios
          .get("/api/generatePdf", {
            params: {
              reimbursementData: reimbursementDataFromDb.value,
              userInfo: response.data[0],
            },
          })
          .then((res) => {
            downloadPDF(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let randomId: string = generateRandomId();
        reimbursementData = {
          reimbursementId: Number(randomId),
          employmentNumber: storedEmploymentNumber,
          eventName: reimbursementTitle.value,
          totalAmount: getAllActivitiesAmount(),
          reimbursementStatus: 0,
          reimbursementDate: getCurrentDate(),
          allActivities: allActivities.value,
        };
        axios
          .get("/api/generatePdf", {
            params: {
              reimbursementData: reimbursementData,
              userInfo: response.data[0],
            },
          })
          .then((res) => {
            downloadPDF(res.data);
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
      .get("/api/retrieveTicketInformation", {
        params: {
          employmentNumber: storedEmploymentNumber,
          reimbursementId: route.query.reimbursementId,
        },
      })
      .then((res) => {
        console.log(res);
        reimbursementDataFromDb.value = res.data[0][0];
        reimbursementTitle.value = res.data[0][0].eventName;
        allActivities.value = res.data[1];
      })
      .catch((err) => {
        console.log(err);
      });
  }
  retrieveFoapaNumbers();
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
