<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <h3 style="margin-top: 0px" class="all-activities-text">All Expenses</h3>
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
          Save Reimbursement Request
        </button>
        <button class="add-actvities-button" @click="createPdf">
          Preview Reimbursement Request
        </button>
        <button class="add-actvities-button" @click="submitTicket">
          Submit Reimbursement Request
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
          v-model="currentReimbursement.reimbursementName"
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
            v-model="currentReimbursement.reimbursementReason"
            class="input-field"
          />
        </span>
        <span>
          <h3 style="font-size: 14.5px">Destination-City,State,Country:</h3>
          <input
            name="expenseReason"
            v-model="currentReimbursement.destination"
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
      <section class="upload-receipts-section">
        <h3 class="upload-receipts-here">Upload all receipts here</h3>
        <div style="display: flex; flex-wrap: wrap; column-gap: 20px">
          <div style="display: flex; align-items: center">
            <div style="display: flex; flex-direction: column">
              <input
                type="file"
                id="receipt"
                class="custom-file-input"
                ref="receiptRef"
                name="receipt"
                @change="receiptAdded"
                accept="image/png, image/jpeg"
                multiple
              />
              <h3 v-if="fileWasSelected" style="font-size: 13px">
                File chosen
              </h3>
            </div>
            <button
              class="save-uploaded-receipts-button"
              @click="storeReceiptImages"
            >
              Save uploaded receipts
            </button>
          </div>
          <div style="display: flex; gap: 30px; align-items: flex-start">
            <a
              :href="(receipt as string)"
              target="_blank"
              style="display: flex; gap: 30px"
              v-for="receipt in currentReimbursement.reimbursementReceipts"
            >
              <img
                :src="(receipt as string)"
                style="
                  width: 40px;
                  aspect-ratio: 1/1;
                  border-radius: 5px;
                  cursor: pointer;
                "
              />
            </a>
          </div>
        </div>
      </section>
      <div class="divider"></div>
      <!-- ACTIVITY SPECIFIC -->
      <Form @submit="addActivity">
        <h3>Add Expense</h3>
        <div style="display: flex; gap: 20px 40px; flex-wrap: wrap">
          <div>
            <div style="display: flex; align-items: center; gap: 12px">
              <h3 style="font-size: 14.5px">Expense Title*</h3>
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
            <div class="expenses-section activity-field">
              <span>
                <Field
                  list="defaults"
                  name="default-options"
                  :rules="isNotEmpty"
                  v-model="currentActivity.activityName"
                  class="input-field"
                />

                <datalist id="defaults">
                  <option :value="expense" v-for="expense in expensesDefaults">
                    {{ expense }}
                  </option>
                </datalist>
                <ErrorMessage name="default-options" class="error-field" />
              </span>
            </div>
          </div>
          <div class="cost-and-other-section">
            <span class="activity-field">
              <h3 style="font-size: 14.5px">Cost *</h3>
              <span>
                <Field
                  v-model="currentActivity.cost"
                  type="text"
                  name="current-activity-cost"
                  placeholder="$ Cost"
                  :rules="isValidNumber"
                  class="input-field"
                />
                <ErrorMessage
                  name="current-activity-cost"
                  class="error-field"
                />
              </span>
            </span>
          </div>
        </div>
        <br />
        <div class="foapa-and-date-section">
          <div class="activity-field" style="height: 105px">
            <h3>FOAPA Number to use *</h3>
            <span>
              <Field
                placeholder="Select FOAPA to pay for activity with"
                as="select"
                class="input-field"
                name="foapa-field"
                :rules="isNotEmpty"
                v-model="currentActivity.foapaNumber"
              >
                <option
                  :value="formatUserFoapa(foapaDetail)"
                  v-for="foapaDetail in userFoapaNumbers"
                >
                  {{ foapaDetail.foapaName }}:
                  {{ formatUserFoapa(foapaDetail) }}
                </option>
              </Field>
              <ErrorMessage name="foapa-field" class="error-field" />
            </span>
          </div>

          <div class="activity-field" style="height: 105px">
            <h3>Date Of Activity *</h3>
            <span>
              <Field
                type="date"
                v-model="currentActivity.activityDate"
                placeholder="Date of Activity"
                class="input-field"
                :rules="isNotEmpty"
                name="date-of-activity"
              />
              <ErrorMessage name="date-of-activity" class="error-field" />
            </span>
          </div>
        </div>
        <h3 v-if="selectedFoapaAmount" class="selected-foapa-amount">
          The Selected FOAPA has ${{ selectedFoapaAmount }}
        </h3>
        <!-- <div class="add-receipt">
          <div class="add-receipt-text">Add Receipt:</div>
          <input
            type="file"
            id="receipt"
            ref="receiptRef"
            name="receipt"
            accept="image/png, image/jpeg"
            multiple
          />
        </div> -->

        <h5 class="terms-and-conditions">
          By adding an activity; I hereby certify that this claim is correct and
          reimbursable under published travel expense Policies & Procedures of
          UDM
        </h5>
        <br />
        <button
          class="add-reimbursement-button"
          type="submit"
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
      </Form>

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
import { Form, Field, ErrorMessage } from "vee-validate";
import { Activity, ReimbursementTicket, FoapaStuff } from "../types/types";
import parseDate from "../utils/parseDate";
import axios from "axios";
import { isNotEmpty, isValidNumber } from "../utils/validators";

const router = useRouter();
const route = useRoute();

const receiptRef = ref(null);
let fileWasSelected = ref<boolean>(false);
let currentActivity = ref<Activity>({
  activityName: "",
  cost: 0,
  activityDate: "",
  activityReceipt: "",
  foapaNumber: "",
});

let currentReimbursement = ref<ReimbursementTicket>({
  reimbursementName: "",
  totalCost: 0,
  reimbursementReason: "",
  reimbursementStatus: "",
  reimbursementDate: parseDate(new Date().toISOString()),
  activities: [],
  reimbursementReceipts: [],
  destination: "",
  paymentRetrievalMethod: "Direct Deposit",
  UDMPUVoucher: false,
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

let userIsEditingReimbursement = ref<boolean>(false);
let currentlyAddingActivity = ref<boolean>(false);
let currentlyUpdatingActivity = ref<boolean>(false);
let currentlyCreatingPDF = ref<boolean>(false);
let userFoapaNumbers = ref<FoapaStuff[]>([]);
let userIsEditingActivity = ref<boolean>(false);

function formatUserFoapa(foapa: FoapaStuff) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

let selectedFoapaAmount = ref<number>();
watch(
  () => currentActivity.value.foapaNumber,
  () => {
    let selectedFoapa = userFoapaNumbers.value.filter(
      (foapa) => formatUserFoapa(foapa) == currentActivity.value.foapaNumber
    );

    if (selectedFoapa.length > 0) {
      if (selectedFoapa[0].currentAmount != null) {
        selectedFoapaAmount.value = Number(selectedFoapa[0].currentAmount);
      } else {
        selectedFoapaAmount.value = undefined;
      }
    }
  }
);

function receiptAdded() {
  fileWasSelected.value = true;
  console.log(receiptRef.value);
  // @ts-ignore
  const files = receiptRef.value.files;
  console.log(files);
}

// ACTIVITY RELATED
function resetActivity() {
  currentActivity.value = {
    activityName: "",
    cost: 0,
    activityDate: "",
    activityReceipt: "",
    foapaNumber: "",
  };

  //@ts-ignore
  receiptRef.value.value = "";
}

async function addActivity(values, { resetForm }) {
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

  if (selectedFoapaAmount.value !== undefined) {
    if (currentActivity.value.cost > (selectedFoapaAmount.value ?? 0)) {
      alert(
        "Warning: Activity cost exceeds the selected FOAPA's current amount"
      );
    }
  }

  if (currentActivity.value.activityName === "Other") {
    alert("Please type in a description of 'Other' expense.");
  } else {
    selectedFoapaAmount.value = 0;
    currentlyAddingActivity.value = true;
    // currentActivity.value.activityReceipt = await storeActivityImage();
    currentReimbursement.value.activities.push(
      Object.assign({}, currentActivity.value)
    );

    resetForm();
    currentlyAddingActivity.value = false;
  }
}

async function storeReceiptImages() {
  let formData = new FormData();

  //@ts-ignore
  const files = receiptRef.value.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    formData.append("receipt", file);
  }

  if (files.length > 0) {
    try {
      // Send the FormData object to the server using axios
      let res = await axios.post(
        "http://localhost:8080/api/storeReceiptImages",
        formData
      );
      fileWasSelected.value = false;

      if (currentReimbursement.value.reimbursementReceipts.length === 0) {
        currentReimbursement.value.reimbursementReceipts = res.data;
      } else {
        currentReimbursement.value.reimbursementReceipts.push(...res.data);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return [];
  }
}

function retrieveFoapaDetails() {
  axios
    .get("http://localhost:8080/api/retrieveFoapaDetails")
    .then((res) => {
      userFoapaNumbers.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function editActivity(activityId: number) {
  // const activity = currentReimbursement.value.activities.find(
  //   (activity) => activity.activityId === activityId
  // );
  // if (activity) {
  //   userIsEditingActivity.value = true;
  //   activity.activityDate = parseDate(activity.activityDate);
  //   currentActivity.value = Object.assign({}, activity);
  //   //@ts-ignore
  //   receiptRef.value.value = "";
  // }
}

function discardActivityChanges() {
  resetActivity();
  userIsEditingActivity.value = false;
}

// UPDATING ACTIVITY

async function updateActivity() {
  // currentlyUpdatingActivity.value = true;
  // let editedActivityIndex = currentReimbursement.value.activities.findIndex(
  //   (activity) => activity.activityId === currentActivity.value.activityId
  // );
  // currentReimbursement.value.totalAmount = getAllActivitiesAmount();
  // currentReimbursement.value.activities[editedActivityIndex] =
  //   currentActivity.value;
  // //@ts-ignore
  // const files = receiptRef.value.files;
  // if (files.length > 0) {
  //   let storedImagesURL = await storeActivityImage();
  //   currentReimbursement.value.activities[editedActivityIndex].activityReceipt =
  //     storedImagesURL;
  // }
  // currentlyUpdatingActivity.value = false;
  // alert("Activity updated successfully");
  // discardActivityChanges();
}

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  currentReimbursement.value.activities.forEach((activity) => {
    sum += Number(activity.cost);
  });
  return sum;
}

function deleteActivity(activityId: number) {
  // currentReimbursement.value.activities =
  //   currentReimbursement.value.activities.filter(
  //     (activity) => activity.activityId != activityId
  //   );
}

async function userIsUpdatingReimbursement() {
  userIsEditingReimbursement.value = true;
  let reimbursement = await axios.get(
    "http://localhost:8080/api/retrieveTicketInformation",
    {
      params: {
        reimbursementId: route.query.reimbursementId,
      },
    }
  );

  currentReimbursement.value = reimbursement.data;
}

async function updateReimbursement() {
  if (currentReimbursement.value.reimbursementName.trim() === "") {
    alert("Reimbursement Title Missing");
    return;
  }
  currentReimbursement.value.totalCost = getAllActivitiesAmount();
  currentReimbursement.value.reimbursementDate = parseDate(
    new Date().toISOString()
  );

  await axios.post("http://localhost:8080/api/updateReimbursement", {
    reimbursementTicket: currentReimbursement.value,
  });
  alert("Reimbursement ticket saved successfully");
  router.push("/dashboard");
}

async function addReimbursement() {
  try {
    if (currentReimbursement.value.reimbursementName.trim() !== "") {
      currentReimbursement.value.totalCost = getAllActivitiesAmount();
      currentReimbursement.value.reimbursementDate = parseDate(
        new Date().toISOString()
      );

      await axios.post("http://localhost:8080/api/addReimbursement", {
        reimbursementTicket: currentReimbursement.value,
      });

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
  currentReimbursement.value.reimbursementStatus = "In Progress";

  if (userIsEditingReimbursement.value === true) {
    updateReimbursement();
  } else {
    addReimbursement();
  }
}

async function submitTicket() {
  try {
    currentReimbursement.value.reimbursementStatus = "Submitted";

    await axios.post("http://localhost:8080/api/updateReimbursement", {
      reimbursementTicket: currentReimbursement.value,
    });

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
    .get(`http://localhost:8080/api/retrieveAccountInformation`)
    .then((response) => {
      if (userIsEditingReimbursement.value === true) {
        currentReimbursement.value.totalCost = getAllActivitiesAmount();
        axios
          .get("http://localhost:8080/api/generatePdf", {
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
          .get("http://localhost:8080/api/generatePdf", {
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
