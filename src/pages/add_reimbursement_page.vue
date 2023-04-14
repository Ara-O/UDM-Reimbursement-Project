<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3>All Activities</h3>
      <div class="activity" v-for="activity in allActivities">
        <h3>{{ activity.chosenExpense }}</h3>
        <h4>
          Date: {{ activity.activityDate }} || Cost: {{ activity.expenseCost }}
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
      <h3 class="reimbursement-title">Reimbursement #1</h3>
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
            type="text"
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

const router = useRouter();

function goToHomePage() {
  router.push("/dashboard");
}

type Activity = {
  chosenExpense: string;
  expenseCost: number;
  foapaNumber: string;
  activityDate: string;
};

let chosenExpense = ref<string>("");
let chosenExpenseOther = ref<string>("");
let expenseCost = ref<number>(0);
let activityDate = ref<string>("");
let foapaNumber = ref<string>("");
let allActivities = ref<Array<Activity>>([
  {
    chosenExpense: "Lodging",
    expenseCost: 3000,
    foapaNumber: "200-011-011",
    activityDate: "12/21/2020",
  },
]);
watch(chosenExpenseOther, (newVal) => {
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
    chosenExpense: chosenExpense.value,
    expenseCost: expenseCost.value,
    foapaNumber: foapaNumber.value,
    activityDate: activityDate.value,
  });

  chosenExpense.value = foapaNumber.value = activityDate.value = "";
  expenseCost.value = 0;
}

const storedEmploymentNumber = localStorage.getItem("employmentNumber");
axios
  .get(`/api/retrieveFoapaNumbers`, {
    params: { employmentNumber: storedEmploymentNumber },
  })
  .then((res) => {
    console.log(res.data);
    foapaNumbersToSelectFrom.value = res.data;
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

function generateRandomId(): string {
  const chars: string = "1234567890";
  let result: string = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function parseReimbursementDate(dateString: string) {
  const parts = dateString.split("/");
  const year = parts[2];
  const month = parts[0].padStart(2, "0");
  const day = parts[1].padStart(2, "0");
  const newDateString = `${year}-${month}-${day}`;
}

function saveReimbursement() {
  let randomId: string = generateRandomId();
  let parsedDate = parseReimbursementDate("04/05/2023");
  let reimbursementData = {
    reimbursementId: 32322,
    employmentNumber: 11,
    eventName: "eventName",
    totalAmount: 20,
    reimbursementStatus: 0,
    reimbursementDate: parsedDate,
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
