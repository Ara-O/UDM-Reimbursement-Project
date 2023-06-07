<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3 style="margin-top: 0px" class="all-activities-text">
        All Activities
      </h3>
      <span class="activities-list">
        <ActivityContainer
          v-for="activity in currentReimbursement.activities"
          :activity="activity"
          @edit-activity="editActivity"
          @delete-activity="deleteActivity"
        />
      </span>
      <div class="cta-buttons">
        <button class="add-actvities-button" @click="saveReimbursement">
          Save Ticket
        </button>
        <button class="add-actvities-button" @click="createPdf">
          Preview Ticket
        </button>
        <button class="add-actvities-button" @click="submitTicket">
          Submit Ticket
        </button>
        <button class="add-actvities-button" @click="router.push('/dashboard')">
          Discard Changes
        </button>
        <h5
          style="font-weight: 400; margin-top: 2px; text-align: center"
          v-show="currentlyCreatingPDF"
        >
          Creating PDF, please wait, this may take a few seconds...
        </h5>
      </div>
    </section>
    <section class="reimbursement-section">
      <div class="reimbursement-title">
        <input
          class="reimbursement-title-text"
          v-model="currentReimbursement.eventName"
          placeholder="Reimbursement Title"
        />
        <img
          src="../assets/edit-icon.png"
          class="edit-icon-button"
          alt="Edit icon"
        />
      </div>
      <h3 style="margin-top: 0px">Reimbursement Ticket Information</h3>
      <div
        style="display: flex; column-gap: 40px; row-gap: 20px; flex-wrap: wrap"
      >
        <span>
          <h3 style="font-size: 14.5px">Reason for Travel/Expense:</h3>
          <input
            name="expenseReason"
            v-model="currentReimbursement.expenseReason"
            class="input-field"
          />
        </span>
        <span>
          <h3 style="font-size: 14.5px">Destination-City,State,Country:</h3>
          <input
            name="expenseReason"
            v-model="currentReimbursement.destinationLocation"
            class="input-field"
          />
        </span>
      </div>
      <br />
      <div
        style="display: flex; column-gap: 30px; row-gap: 20px; flex-wrap: wrap"
      >
        <span style="display: flex; gap: 3px">
          <input
            type="radio"
            value="Hold for Pickup"
            id="hold-for-pickup"
            v-model="currentReimbursement.paymentRetrievalMethod"
          />
          <label for="hold-for-pickup" style="font-size: 14px"
            >Hold for Pickup</label
          >
        </span>
        <span style="display: flex; gap: 7px">
          <input
            type="radio"
            value="Direct Deposit"
            id="direct-deposit"
            v-model="currentReimbursement.paymentRetrievalMethod"
          />
          <label for="direct-deposit" style="font-size: 14px"
            >Direct Deposit</label
          >
        </span>
        <span style="display: flex; gap: 7px">
          <input
            type="checkbox"
            id="udmpu-voucher"
            v-model="currentReimbursement.UDMPUVoucher"
          />
          <label for="udmpu-voucher" style="font-size: 14px"
            >Check if using UDMPU 11.6 voucher (please attach
            voucher/log)</label
          >
        </span>
      </div>
      <div class="divider"></div>
      <!-- ACTIVITY SPECIFIC -->
      <h3>Add Activity</h3>
      <div style="display: flex; gap: 20px 40px; flex-wrap: wrap">
        <div>
          <div style="display: flex; align-items: center; gap: 12px">
            <h3 style="font-size: 14.5px">Expenses</h3>
            <img
              src="../assets/user-help-icon.png"
              alt="Help icon"
              title=" Choose from one of the default options below or select other to create another type of expense"
              class="help-icon"
            />
            <h3 style="font-size: 14px; font-weight: 400">
              &lt;- Hover for help
            </h3>
          </div>
          <div class="expenses-section">
            <input
              list="defaults"
              name="defaultOptions"
              v-model="currentActivity.activityName"
              class="input-field"
            />

            <datalist id="defaults">
              <option :value="expense" v-for="expense in expensesDefaults">
                {{ expense }}
              </option>
            </datalist>
          </div>
        </div>
        <div class="cost-and-other-section">
          <span>
            <h3 style="font-size: 14.5px">Cost:</h3>
            <input
              v-model="currentActivity.amount"
              type="number"
              placeholder="$ Cost"
              min="0"
              class="input-field"
            />
          </span>
        </div>
      </div>
      <br />
      <div class="foapa-and-date-section">
        <div>
          <h3>FOAPA Number to use:</h3>
          <select
            placeholder="Select FOAPA to pay for activity with"
            class="input-field"
            v-model="currentActivity.foapaNumber"
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
            v-model="currentActivity.activityDate"
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
          id="receipt"
          ref="receiptRef"
          name="receipt"
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
        v-if="!userIsEditingActivity"
      >
        Add Activity
      </button>
      <span style="display: flex; gap: 30px">
        <button
          class="add-reimbursement-button"
          @click="updateActivity"
          v-if="userIsEditingActivity"
        >
          Update Activity
        </button>
        <button
          class="add-reimbursement-button"
          @click="discardActivityChanges"
          v-if="userIsEditingActivity"
        >
          Discard Changes
        </button>
      </span>

      <h5 style="font-weight: 400" v-show="currentlyAddingActivity">
        Adding activity, please wait...
      </h5>
      <h5 style="font-weight: 400" v-show="currentlyUpdatingActivity">
        Updating activity, please wait...
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
import ActivityContainer from "../components/add-reimbursement/ActivityContainer.vue";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Activity, FoapaNumbers, ReimbursementTicket } from "../types/types";
import generateRandomId from "../utils/generateRandomId";
import parseDate from "../utils/parseDate";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const receiptRef = ref(null);

let currentActivity = ref<Activity>({
  activityId: generateRandomId(),
  activityName: "",
  amount: 0,
  activityDate: "",
  activityReceipt: "",
  foapaNumber: "",
});

let currentReimbursement = ref<ReimbursementTicket>({
  reimbursementId: generateRandomId(),
  eventName: "",
  totalAmount: 0,
  reimbursementStatus: "",
  reimbursementDate: parseDate(new Date().toISOString()),
  activities: [],
  expenseReason: "",
  destinationLocation: "",
  paymentRetrievalMethod: "",
  UDMPUVoucher: false,
});

let userIsEditingReimbursement = ref<boolean>(false);
let currentlyAddingActivity = ref<boolean>(false);
let currentlyUpdatingActivity = ref<boolean>(false);
let currentlyCreatingPDF = ref<boolean>(false);
let userFoapaNumbers = ref<FoapaNumbers[]>([]);
let userIsEditingActivity = ref<boolean>(false);

let selectedFoapaAmount = ref<number>();
watch(
  () => currentActivity.value.foapaNumber,
  () => {
    let selectedFoapa = userFoapaNumbers.value.filter(
      (foapa) => foapa.foapaNumber == currentActivity.value.foapaNumber
    );

    if (selectedFoapa.length > 0) {
      if (selectedFoapa[0].currentAmount != "N/A") {
        selectedFoapaAmount.value = selectedFoapa[0].currentAmount;
      } else {
        selectedFoapaAmount.value = undefined;
      }
    }
  }
);

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

// ACTIVITY RELATED

function resetActivity() {
  currentActivity.value = {
    activityId: generateRandomId(),
    activityName: "",
    amount: 0,
    activityDate: "",
    activityReceipt: "",
    foapaNumber: "",
  };

  //@ts-ignore
  receiptRef.value.value = "";
}

async function addActivity() {
  let allActivitiesOccurence = {};
  let limitReached: boolean = false;
  currentReimbursement.value.activities.forEach((activity) => {
    if (allActivitiesOccurence[activity.activityName] === undefined) {
      allActivitiesOccurence[activity.activityName] = 1;
    } else {
      allActivitiesOccurence[activity.activityName]++;
    }
  });
  if (allActivitiesOccurence[currentActivity.value.activityName] >= 7) {
    alert("You have reached the limit of expenses with this activity");
    limitReached = true;
  }

  if (limitReached) return;

  if (
    String(currentActivity.value.amount).includes("-") ||
    String(currentActivity.value.amount).trim() === ""
  ) {
    alert("Invalid character/s in the cost field");
    return;
  }

  console.log(selectedFoapaAmount.value);
  if (selectedFoapaAmount.value !== undefined) {
    if (currentActivity.value.amount > (selectedFoapaAmount.value ?? 0)) {
      alert(
        "Warning: Activity cost exceeds the selected FOAPA's current amount"
      );
    }
  }

  if (currentActivity.value.activityName === "Other") {
    alert("Please type in a description of 'Other' expense.");
  } else if (
    currentActivity.value.activityName !== "" &&
    currentActivity.value.amount !== 0 &&
    currentActivity.value.foapaNumber !== "" &&
    currentActivity.value.activityDate !== ""
  ) {
    selectedFoapaAmount.value = 0;
    currentlyAddingActivity.value = true;
    currentActivity.value.activityReceipt = await storeActivityImage();
    currentReimbursement.value.activities.push(
      Object.assign({}, currentActivity.value)
    );

    resetActivity();
    currentlyAddingActivity.value = false;
  } else {
    alert("Missing field, please check to make sure all fields are filled");
  }
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

function editActivity(activityId: number) {
  const activity = currentReimbursement.value.activities.find(
    (activity) => activity.activityId === activityId
  );

  if (activity) {
    userIsEditingActivity.value = true;
    activity.activityDate = parseDate(activity.activityDate);
    currentActivity.value = Object.assign({}, activity);
    //@ts-ignore
    receiptRef.value.value = "";
  }
}

function discardActivityChanges() {
  resetActivity();
  userIsEditingActivity.value = false;
}

// UPDATING ACTIVITY

async function updateActivity() {
  currentlyUpdatingActivity.value = true;
  let editedActivityIndex = currentReimbursement.value.activities.findIndex(
    (activity) => activity.activityId === currentActivity.value.activityId
  );

  currentReimbursement.value.totalAmount = getAllActivitiesAmount();

  currentReimbursement.value.activities[editedActivityIndex] =
    currentActivity.value;

  //@ts-ignore
  const files = receiptRef.value.files;
  if (files.length > 0) {
    let storedImagesURL = await storeActivityImage();
    currentReimbursement.value.activities[editedActivityIndex].activityReceipt =
      storedImagesURL;
  }

  currentlyUpdatingActivity.value = false;
  alert("Activity updated successfully");
  discardActivityChanges();
}

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  currentReimbursement.value.activities.forEach((activity) => {
    sum += Number(activity.amount);
  });
  return sum;
}

function deleteActivity(activityId: number) {
  currentReimbursement.value.activities =
    currentReimbursement.value.activities.filter(
      (activity) => activity.activityId != activityId
    );
}

async function userIsUpdatingReimbursement() {
  userIsEditingReimbursement.value = true;
  let reimbursement = await axios.get(
    "https://reimbursement-project.onrender.com/api/retrieveTicketInformation",
    {
      params: {
        reimbursementId: route.query.reimbursementId,
      },
    }
  );

  currentReimbursement.value = reimbursement.data;
}

async function updateReimbursement() {
  if (currentReimbursement.value.eventName.trim() === "") {
    alert("Reimbursement Title Missing");
    return;
  }
  currentReimbursement.value.totalAmount = getAllActivitiesAmount();
  currentReimbursement.value.reimbursementDate = parseDate(
    new Date().toISOString()
  );

  await axios.post(
    "https://reimbursement-project.onrender.com/api/updateReimbursement",
    {
      reimbursementTicket: currentReimbursement.value,
    }
  );
  alert("Reimbursement ticket saved successfully");
  router.push("/dashboard");
}

async function addReimbursement() {
  try {
    if (currentReimbursement.value.eventName.trim() !== "") {
      currentReimbursement.value.totalAmount = getAllActivitiesAmount();
      currentReimbursement.value.reimbursementDate = parseDate(
        new Date().toISOString()
      );

      await axios.post(
        "https://reimbursement-project.onrender.com/api/addReimbursement",
        {
          reimbursementTicket: currentReimbursement.value,
        }
      );

      router.push("/dashboard");

      alert("Reimbursement saved successfully");
    } else {
      alert("Reimbursement Title Missing");
    }
  } catch (error) {
    console.log(error);
  }
}

async function saveReimbursement() {
  if (userIsEditingReimbursement.value === true) {
    updateReimbursement();
  } else {
    addReimbursement();
  }
}

async function submitTicket() {
  try {
    currentReimbursement.value.reimbursementStatus = "Submitted";

    await axios.post(
      "https://reimbursement-project.onrender.com/api/submitTicket",
      {
        currentReimbursement: currentReimbursement.value.reimbursementStatus,
      }
    );

    router.push("/dashboard");
    alert("Reimbursement ticket submitted successfully");
  } catch (error) {
    console.log(error);
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
  if (currentReimbursement.value.activities.length === 0) {
    return alert("A minimum of one activity is needed to preview a ticket");
  }

  currentlyCreatingPDF.value = true;
  //Send user information

  for (let i = 0; i < currentReimbursement.value.activities.length; i++) {
    if (currentReimbursement.value.activities[i].activityReceipt === "") {
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
        currentReimbursement.value.totalAmount = getAllActivitiesAmount();
        axios
          .get("https://reimbursement-project.onrender.com/api/generatePdf", {
            params: {
              reimbursementData: currentReimbursement.value,
              userInfo: response.data,
            },
          })
          .then((res) => {
            downloadPDF(res.data);
            currentlyCreatingPDF.value = false;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .get("https://reimbursement-project.onrender.com/api/generatePdf", {
            params: {
              reimbursementData: currentReimbursement.value,
              userInfo: response.data,
            },
          })
          .then((res) => {
            downloadPDF(res.data);
            currentlyCreatingPDF.value = false;
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
    userIsUpdatingReimbursement();
  }
  retrieveFoapaDetails();
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
