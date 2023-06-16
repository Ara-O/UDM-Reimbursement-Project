<template>
  <Form @submit="submitActivityForm">
    <h3>Add Expense</h3>
    <div class="expenses-fields-wrapper">
      <div>
        <div style="display: flex; align-items: center; gap: 12px">
          <h3 style="font-size: 14.5px">Expense Title*</h3>
          <img
            src="../../assets/user-help-icon.png"
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
            <ErrorMessage name="current-activity-cost" class="error-field" />
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
    <!-- <h3 v-if="selectedFoapaAmount" class="selected-foapa-amount">
      The Selected FOAPA has ${{ selectedFoapaAmount }}
    </h3> -->
    <br />
    <div class="activity-add-receipt-section">
      <div class="activity-field">
        <div class="add-receipt-text">Add Receipt:</div>
        <span>
          <Field
            as="select"
            class="input-field"
            name="receipt-field"
            v-model="currentActivity.activityReceipt"
          >
            <option
              v-for="(receipt, index) in props.currentReimbursement
                .reimbursementReceipts"
              :value="receipt.url"
            >
              Receipt #{{ index + 1 }}
            </option>
          </Field>
          <ErrorMessage name="receipt-field" class="error-field" />
        </span>
      </div>
    </div>

    <h5 class="terms-and-conditions">
      By adding an activity; I hereby certify that this claim is correct and
      reimbursable under published travel expense Policies & Procedures of UDM
    </h5>
    <br />
    <button
      class="add-reimbursement-button"
      type="submit"
      :disabled="currentlyAddingActivity"
    >
      {{ !userIsEditingActivity ? "Add Activity" : "Update Activity" }}
    </button>
    <!-- <span style="display: flex; gap: 30px">
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
    </span> -->
  </Form>

  <h5 style="font-weight: 400" v-show="currentlyAddingActivity">
    Adding activity, please wait...
  </h5>
  <h5 style="font-weight: 400" v-show="currentlyUpdatingActivity">
    Updating activity, please wait...
  </h5>
</template>

<script setup lang="ts">
import { isNotEmpty, isValidNumber } from "../../utils/validators";
import { ref, watch, toRefs, onMounted } from "vue";
import axios from "axios";
import { Activity, ReimbursementTicket, FoapaStuff } from "../../types/types";
import { Form, Field, ErrorMessage } from "vee-validate";
import { generateRandomStringId } from "../../utils/generateRandomId";
let currentlyAddingActivity = ref<boolean>(false);
let currentlyUpdatingActivity = ref<boolean>(false);

let props = defineProps<{
  currentReimbursement: ReimbursementTicket;
  currentActivity: Activity;
  userIsEditingActivity: Boolean;
}>();
let emits = defineEmits(["userHasFinishedEditingActivity"]);
const { currentReimbursement, currentActivity, userIsEditingActivity } =
  toRefs(props);

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

let selectedFoapaAmount = ref<number>();
let userFoapaNumbers = ref<FoapaStuff[]>([]);
function formatUserFoapa(foapa: FoapaStuff) {
  return `${foapa.fund}-${foapa.organization || "XXXX"}-${foapa.account}-${
    foapa.program || "XXXX"
  }-${foapa.activity || "XXXX"}`;
}

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
// let allActivitiesOccurence = {};
//   let limitReached: boolean = false;
//   currentReimbursement.value.activities.forEach((activity) => {
//     if (allActivitiesOccurence[activity.activityName] === undefined) {
//       allActivitiesOccurence[activity.activityName] = 1;
//     } else {
//       allActivitiesOccurence[activity.activityName]++;
//     }
//   });
//   if (allActivitiesOccurence[currentActivity.value.activityName] >= 7) {
//     alert("You have reached the limit of expenses with this activity");
//     limitReached = true;
//   }

//   if (limitReached) return;

function addActivity(resetForm) {
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
    currentReimbursement.value.activities.push(
      Object.assign({}, currentActivity.value)
    );

    currentlyAddingActivity.value = false;
    resetForm();
  }
}
function getAllActivitiesAmount(): number {
  let sum: number = 0;
  props.currentReimbursement.activities.forEach((activity) => {
    sum += Number(activity.cost);
  });
  return sum;
}

function updateActivity(resetForm) {
  let changedActivity = Object.assign({}, currentActivity.value);
  currentlyUpdatingActivity.value = true;
  let editedActivityIndex = currentReimbursement.value.activities.findIndex(
    (activity) => activity.activityId === changedActivity.activityId
  );
  currentReimbursement.value.totalCost = getAllActivitiesAmount();
  currentReimbursement.value.activities[editedActivityIndex] = changedActivity;
  currentlyUpdatingActivity.value = false;

  if (currentActivity.value._id) {
    delete currentActivity.value._id;
  }
  emits("userHasFinishedEditingActivity");
  resetForm();
}

async function submitActivityForm(values, { resetForm }) {
  if (userIsEditingActivity.value) {
    updateActivity(resetForm);
  } else {
    addActivity(resetForm);
  }
  currentActivity.value.activityId = generateRandomStringId(24);
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

onMounted(() => {
  retrieveFoapaDetails();
});
</script>

<style scoped>
@import url("../../assets/styles/add-reimbursement-page.css");
</style>
