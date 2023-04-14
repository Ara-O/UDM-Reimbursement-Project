<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3>All Activities</h3>
      <div class="activity" v-for="activity in allActivities">
        <h3>{{ activity.activityName }}</h3>
        <h4>
          Date: {{ activity.activityDate }} || Cost: {{ activity.amount }}
        </h4>
        <h4>Foapa Number: {{ activity.foapaNumber }}</h4>
        <div class="delete-option">
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
        <button class="go-back-button" @click="saveReimbursement">
          Save to PDF
        </button>
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
      <h4 style="font-weight: 500">Expenses</h4>
      <div class="expenses-section">
        <div
          v-for="expense in expensesDefaults"
          @click="chosenExpense = expense"
          class="expense"
        >
          {{ expense }}
        </div>
      </div>
      <br />
      <div class="cost-and-other-section">
        <span>
          <h3>Other:</h3>
          <input
            v-model="chosenExpenseOther"
            type="text"
            placeholder="Select Expense name"
            class="input-field"
          />
        </span>
        <br />
        <span>
          <h3>Cost:</h3>
          <input
            v-model="expenseCost"
            type="text"
            placeholder="$ Cost"
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
          name="avatar"
          accept="image/png, image/jpeg"
        />
      </div>
      <h5 class="terms-and-conditions">
        By adding an activity; I hereby certify that this claim is correct and
        reimbursable under published travel expense Policies & Procedures of UDM
      </h5>
      <br />
      <button class="add-reimbursement-button" @click="addReimbursement">
        Add Reimbursement
      </button>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { stringifyExpression } from "@vue/compiler-core";

const router = useRouter();

function goToHomePage() {
  router.push("/dashboard");
}

type Activity = {
  activityId: number;
  activityName: string;
  amount: number;
  foapaNumber: string;
  activityDate: string;
  activityReceipt: string;
};

let chosenExpense = ref<string>("");
let chosenExpenseOther = ref<string>("");
let expenseCost = ref<number>(0);
let activityDate = ref<string>("");
let foapaNumber = ref<string>("");
let reimbursementTitle = ref<string>("testing");

let allActivities = ref<Array<Activity>>([]);

watch(chosenExpenseOther, (newVal) => {
  console.log("test");
  if (newVal.length >= 0) {
    chosenExpense.value = chosenExpenseOther.value;
  }
});

const expensesDefaults = [
  "Lodging",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Other",
  "Business Guest Meals",
  "Air/Train",
  "Parking",
  "Mileage",
  "Taxi/Bus/Car Rental",
  "Parking",
  "Registration",
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

function addReimbursement() {
  allActivities.value.push({
    activityName: chosenExpense.value,
    amount: expenseCost.value,
    foapaNumber: foapaNumber.value,
    activityDate: activityDate.value,
    activityId: Number(generateRandomId()),
    activityReceipt: "Activity Receipt",
  });

  console.log(allActivities.value);

  chosenExpense.value = foapaNumber.value = activityDate.value = "";
  expenseCost.value = 0;
}

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

function generateRandomId(): string {
  const chars: string = "1234567890";
  let result: string = "";
  for (let i = 0; i < 9; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
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

function saveReimbursement() {
  let randomId: string = generateRandomId();
  let reimbursementData = {
    reimbursementId: Number(randomId),
    employmentNumber: storedEmploymentNumber,
    eventName: reimbursementTitle.value,
    totalAmount: getAllActivitiesAmount(),
    reimbursementStatus: 0,
    reimbursementDate: getCurrentDate(),
    allActivities: allActivities.value,
  };

  axios
    .post(`/api/addReimbursement`, {
      reimbursementData,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
