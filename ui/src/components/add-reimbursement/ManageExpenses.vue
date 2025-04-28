<template>
  <section class="xl:w-auto xl:ml-0 sm:mt-0 mb-32 sm:mb-0">
    <span class="flex items-center gap-6 mb-2">
      <h2 class="font-semibold my-0 text-[27px]">Add or View Expenses</h2>
      <img
        src="../../assets/edit-icon.png"
        alt="Edit icon"
        class="w-7 hidden md:block"
      />
    </span>

    <form @submit.prevent="addExpense">
      <div class="flex gap-x-14 gap-y-3 flex-wrap">
        <span>
          <h4 class="font-normal text-sm">Expense Name</h4>

          <Select
            v-model="expense.name"
            :options="defaultExpenses"
            style="width: 18rem !important"
            :invalid="expense_field_is_empty"
            :disabled="view_only_mode === true"
            placeholder="Select an Expense"
            class="border-[0.5px] h-11 flex items-center rounded-md !border-gray-200 box-border text-xs border-solid !shadow-md"
          />
        </span>
        <span v-if="expense.name === 'Other' || expense.name === 'Mileage'">
          <h4 class="font-normal text-sm">
            {{
              expense.name === "Other"
                ? "Additional Information"
                : "Mileage Destination"
            }}
            <a
              href="https://www.irs.gov/tax-professionals/standard-mileage-rates"
              v-if="expense.name === 'Mileage'"
              target="_blank"
              >View Rates</a
            >
            <p class="inline" v-if="expense.name === 'Mileage'">
              &nbsp;/&nbsp;
            </p>
            <a
              href="https://www.travelperk.com/calculators/mileage-reimbursement/us/"
              v-if="expense.name === 'Mileage'"
              target="_blank"
              >Calculate Rates</a
            >
          </h4>
          <input
            type="text"
            :disabled="view_only_mode === true"
            name="additional-information"
            :placeholder="otherPlaceholderText(expense.name)"
            v-model="expense.additionalInformation"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            required
          />
        </span>
        <span>
          <h4 class="font-normal text-sm">Expense Cost</h4>
          <span
            style="
              position: absolute;
              padding-left: 0.75rem;
              padding-top: 10px;
              opacity: 50%;
            "
            >$</span
          >
          <input
            type="text"
            name="expense-cost"
            placeholder="Expense Cost"
            :disabled="view_only_mode === true"
            v-model="expense.cost"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            style="padding-left: 2rem"
            required
          />
        </span>
        <span>
          <h4 class="font-normal text-sm">Expense Date</h4>
          <input
            type="date"
            name="activity-date"
            placeholder="Activity Date"
            :disabled="view_only_mode === true"
            v-model="expense.date"
            class="border-[0.5px] h-11 rounded-md border-gray-200 w-72 box-border px-5 text-xs border-solid shadow-md"
            required
          />
        </span>
      </div>

      <h4 class="text-[13px] font-light text-gray-700 leading-7 w-auto">
        By adding an activity; I hereby certify that this claim is correct and
        reimbursable under published travel expense
        <a
          href="https://www.udmercy.edu/faculty-staff/procurement-services/policies.php"
          target="_blank"
        >
          Policies & Procedures of UDM
        </a>
      </h4>

      <div class="flex gap-5">
        <button
          type="submit"
          :disabled="view_only_mode === true"
          class="bg-udmercy-blue text-white disabled:bg-gray-500 border-none w-40 h-11 rounded-full cursor-pointer text-xs"
        >
          Add Expense
        </button>
      </div>
    </form>

    <!-- ALL EXPENSES SECTION -->
    <h4 class="underline font-semibold text-lg text-gray-800">All Expenses</h4>
    <div
      class="h-48 sm:h-auto overflow-auto flex gap-4 flex-wrap custom-scroll-bar w-auto"
    >
      <h5
        class="mt-0 font-medium text-gray-500"
        v-if="props.claim.activities.length === 0"
      >
        Added expenses will be listed here.
      </h5>

      <activity-container
        :expense="expense"
        :view_only_mode="view_only_mode"
        v-for="expense in props.claim.activities"
        @delete-activity="deleteExpense"
        @edit-activity="editExpense"
        @duplicate-activity="duplicateExpense"
      ></activity-container>
    </div>
    <div class="flex gap-8 items-center">
      <button
        type="button"
        @click="moveToPreviousSection"
        class="bg-udmercy-blue mt-6 text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-3"
      >
        <img src="../../assets/next-arrow.png" class="w-3 rotate-180" />
        Previous Section
      </button>
      <button
        type="button"
        @click="moveToNextSection"
        class="mt-6 bg-udmercy-blue text-white border-none w-40 h-11 rounded-full cursor-pointer text-xs flex justify-center items-center gap-5"
      >
        Next Section
        <img src="../../assets/next-arrow.png" class="w-3" />
      </button>
    </div>
  </section>
  <section
    v-if="quickAddPopupIsVisible"
    class="absolute flex items-center justify-center top-0 left-0 h-full bg-black bg-opacity-80 w-full"
  >
    <quick-add-popup
      @close-quick-add-popup="quickAddPopupIsVisible = false"
    ></quick-add-popup>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ReimbursementTicket, Expense } from "../../types/types";
import ActivityContainer from "./ActivityContainer.vue";
import { generateRandomStringId } from "../../utils/generateRandomId";
import { TYPE, useToast } from "vue-toastification";
import QuickAddPopup from "./QuickAddPopup.vue";
import Select from "primevue/select";

const props = defineProps<{
  claim: ReimbursementTicket;
  view_only_mode: Boolean;
}>();

const quickAddPopupIsVisible = ref<boolean>(false);

function showQuickAddPopup() {
  quickAddPopupIsVisible.value = true;
}
const toast = useToast();
const expense_field_is_empty = ref<boolean>(false);
const emits = defineEmits(["move-to-next-section", "move-to-previous-section"]);

let expense = ref<Expense>({
  name: "",
  cost: 0,
  date: "",
  id: generateRandomStringId(24),
});

const defaultExpenses = [
  "Air/Train",
  "Breakfast",
  "Business Guest Meals",
  "Dinner",
  "Lodging",
  "Lunch",
  "Mileage",
  "Parking",
  "Registration",
  "Taxi/Bus/Car Rental",
  "Other",
];

function moveToNextSection() {
  if (expense.value.name !== "" || expense.value.date !== "") {
    const moveon = confirm(
      "Warning: You have data in the Add Expense Section thar you have not added. Click 'OK' if you want to discard the data and move to the next section, or 'Cancel' to return"
    );

    if (moveon) {
      emits("move-to-next-section");
    }
    return;
  }
  emits("move-to-next-section");
}

function moveToPreviousSection() {
  emits("move-to-previous-section");
}

function otherPlaceholderText(expense_type: string) {
  if (expense_type === "Other") {
    return "Explain what expense is for";
  }

  if ((expense_type = "Mileage")) {
    return "Include Destination and Mileage Rate"; //Include Destination for Mileage
  }

  return "";
}

function addExpense() {
  const regex = /^\d+(\.\d{1,2})?$/;
  if (!regex.test(String(expense.value.cost))) {
    toast.clear();
    toast("Error: Expense cost must be a valid number", {
      type: TYPE.ERROR,
    });
    return;
  }

  if (expense.value.name.trim() === "") {
    expense_field_is_empty.value = true;

    window.setTimeout(() => {
      expense_field_is_empty.value = false;
    }, 1000);
    return;
  }

  let other_claims = 0;
  props.claim.activities.forEach((exp) => {
    if (exp.name === "Other") {
      other_claims++;
    }
  });

  if (other_claims == 2) {
    toast(
      "Due to constraints, reimbursement claims may not have more than 2 'Other' expenses. Please contact Jim Adair directly.",
      {
        type: TYPE.ERROR,
      }
    );
    return;
  }

  // Pushing a duplicate of the inputted expense to the main reimbursement data
  props.claim.activities.push(JSON.parse(JSON.stringify(expense.value)));
  expense.value = {
    name: "",
    cost: 0,
    date: "",
    id: generateRandomStringId(24),
    additionalInformation: "",
  };
}

function deleteExpense(id: string) {
  props.claim.activities = props.claim.activities.filter(
    (activity) => activity.id !== id
  );
}

function editExpense(id: string) {
  let activityToEdit = props.claim.activities.filter(
    (activity) => activity.id === id
  );

  if (activityToEdit.length === 0) return;

  activityToEdit[0].date = activityToEdit[0].date;
  expense.value = activityToEdit[0];
  deleteExpense(activityToEdit[0].id);
}

function duplicateExpense(id: string) {
  let activityToDuplicate = props.claim.activities.filter(
    (activity) => activity.id === id
  );

  if (activityToDuplicate.length === 0) return;

  let clone = JSON.parse(JSON.stringify(activityToDuplicate[0]));
  delete clone?._id;
  clone.id = generateRandomStringId(24);
  expense.value = clone;
}
</script>

<style scoped>
.custom-scroll-bar::-webkit-scrollbar {
  width: 6px;
}

/* Track */
.custom-scroll-bar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.custom-scroll-bar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #acacac;
}

.p-select:not(.p-disabled).p-focus {
  border-color: lightgray;
}

.p-invalid {
  border: solid 1px red !important;
}

.p-select + .p-component + .p-inputwrapper + .p-disabled {
  background-color: pink !important;
}

.p-select.p-disabled {
  background-color: white;
}
</style>
