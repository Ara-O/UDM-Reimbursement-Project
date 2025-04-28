<template>
  <!-- Return to dashboard -->
  <div class="flex justify-between gap-4 mt-8">
    <div
      class="mx-10 mb-5 xl:ml-28 cursor-pointer"
      @click="goToDashboard"
      v-if="!coming_from_foapa_page"
    >
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm text-gray-600 hover:underline">
        Return to dashboard
      </h4>
    </div>
    <div
      class="flex items-center gap-4 absolute top-8 sm:ml-20 ml-10 xl:ml-32 cursor-pointer"
      @click="router.go(-1)"
      v-else
    >
      <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
      <h4 class="font-normal text-sm vs text-gray-600">Return to FOAPA page</h4>
    </div>

    <div class="flex mr-28 items-center gap-4">
      <span
        class="inline-flex items-center gap-3 cursor-pointer"
        @click="viewRequestHistory"
        v-if="currentReimbursement.reimbursementStatus !== 'Denied'"
      >
        <img :src="HistoryIcon" alt="History" class="w-3 my-0" />
        <p class="text-udmercy-blue my-0 text-sm underline inline">
          Request History
        </p>
      </span>
    </div>
  </div>

  <!-- Section value -->
  <Stepper :value="selectedSection" class="hidden md:block xl:px-28 px-10">
    <StepList>
      <Step
        @click="changeSection(section.section)"
        :value="section.section"
        v-for="section in sections"
        :pt="{
          title: '  focus:!text-udmercy-blue',
        }"
        >{{ section.title }}</Step
      >
    </StepList>
  </Stepper>

  <main class="flex mt-10 mb-10 px-10 xl:px-28 gap-20">
    <!-- <div class="flex mt-3 justify-center items-center gap-4">
      <span
        class="inline-flex items-center gap-3 cursor-pointer"
        @click="viewRequestHistory"
      >
        <img :src="HistoryIcon" alt="History" class="w-4" />
        <p class="text-udmercy-blue text-sm underline inline">
          Request History
        </p>
      </span>
    </div> -->
    <!-- VIEW ONLY MODE WARNING -->
    <div
      class="absolute bottom-4 z-10 right-4 rounded-lg bg-udmercy-red max-w-[30rem] text-white px-7 pt-1 pb-2"
      v-if="view_only_mode"
    >
      <p class="underline font-medium">Warning</p>
      <p class="font-normal leading-7">
        You are in view-only mode. This is because this request has already
        being approved, or is awaiting approval by the admin.
      </p>
    </div>
    <!-- INFO SECTION -->
    <section class="w-auto">
      <claim-information
        :claim="currentReimbursement"
        :view_only_mode="view_only_mode"
        v-if="selectedSection === 1"
        @move-to-next-section="moveToNextSection"
      ></claim-information>
      <manage-expenses
        :claim="currentReimbursement"
        :view_only_mode="view_only_mode"
        v-if="selectedSection === 2"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></manage-expenses>
      <assign-foapa-information
        :claim="currentReimbursement"
        :view_only_mode="view_only_mode"
        v-if="selectedSection === 3"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></assign-foapa-information>
      <manage-receipts
        :claim="currentReimbursement"
        :view_only_mode="view_only_mode"
        v-if="selectedSection === 4"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></manage-receipts>
      <finish
        :claim="currentReimbursement"
        :view_only_mode="view_only_mode"
        v-if="selectedSection === 5"
        @on-claim-saved="onClaimSaved"
        @move-to-previous-section="moveToPreviousSection"
      ></finish>
    </section>
    <confirmation-popup
      left-button-text="Discard Changes"
      right-button-text="Go back"
      v-if="show_confirm_dialog"
      :cancel-function="discardChangesAndLeavePage"
      :continue-function="goBack"
    >
      <template #message>
        You are about to leave this page without saving this reimbursement
        claim. This will discard your changes. To go back, click 'Go back'. To
        discard your changes and leave the page, click 'Discard Changes'
      </template>
    </confirmation-popup>
  </main>

  <div class="card flex justify-content-center">
    <Sidebar
      v-model:visible="request_history_sidebar_is_visible"
      header="Request History"
      position="right"
    >
      <div v-for="history in currentReimbursement.request_history">
        <p class="mb-2 leading-7">{{ history.request_message }}</p>
        <p class="text-sm mt-0 text-gray-500">{{ history.date_of_message }}</p>
        <hr class="text-gray-200 h-0.5 bg-gray-200 border-solid" />
      </div>
      <div
        v-if="
          currentReimbursement.request_history &&
          currentReimbursement.request_history.length === 0
        "
      >
        <p class="text-sm">You just started this request</p>
      </div>
    </Sidebar>
  </div>
  <p
    class="absolute bottom-3 text-sm right-10 text-gray-500"
    v-if="autosave_label"
  >
    Autosaved...
  </p>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { ReimbursementTicket } from "../types/types";
import claimInformation from "../components/add-reimbursement/ClaimInformation.vue";
import manageExpenses from "../components/add-reimbursement/ManageExpenses.vue";
import ManageReceipts from "../components/add-reimbursement/ManageReceipts.vue";
import Finish from "../components/add-reimbursement/Finish.vue";
import AssignFoapaInformation from "../components/add-reimbursement/AssignFoapaInformation.vue";
import ConfirmationPopup from "../components/utilities/ConfirmationPopup.vue";
import HistoryIcon from "../assets/black-history.png";
import Sidebar from "primevue/sidebar";

import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import StepItem from "primevue/stepitem";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
function goToDashboard() {
  router.push("/");
}

const router = useRouter();
const route = useRoute();

let show_confirm_dialog = ref<boolean>(false);
let user_has_unsaved_changes = ref<boolean>(false);
let claim_is_being_saved = ref<boolean>(false);
let selectedSection = ref<number>(1);
const view_only_mode = ref<boolean>(false);
const request_history_sidebar_is_visible = ref<boolean>(false);
const coming_from_foapa_page = ref<boolean>(false);

let sections = ref([
  {
    title: "Claim Information",
    section: 1,
  },
  {
    title: "Expenses",
    section: 2,
  },
  {
    title: "FOAPA Information",
    section: 3,
  },
  {
    title: "Receipts",
    section: 4,
  },
  {
    title: "Finish",
    section: 5,
  },
]);

function changeSection(section: number) {
  selectedSection.value = section;
}

let currentReimbursement = ref<ReimbursementTicket>({
  reimbursementName: "",
  totalCost: 0,
  reimbursementReason: "",
  reimbursementStatus: "",
  reimbursementDate: new Date().toISOString(),
  activities: [],
  reimbursementReceipts: [],
  destination: "",
  paymentRetrievalMethod: "Direct Deposit",
  UDMPUVoucher: false,
  guestInformation: [],
  foapaDetails: [],
  request_history: [],
});

function moveToNextSection() {
  selectedSection.value++;
  window.scrollTo(0, 0);
}

function moveToPreviousSection() {
  selectedSection.value--;
  window.scrollTo(0, 0);
}

function startListeningForReimbursementChanges() {
  watch(currentReimbursement.value, () => {
    if (claim_is_being_saved.value === false) {
      user_has_unsaved_changes.value = true;
    }
  });
}

function onClaimSaved() {
  claim_is_being_saved.value = true;
  user_has_unsaved_changes.value = false;
  show_confirm_dialog.value = false;
}

/**
 * Retrieves the reimbursement ticket that the user is currently updating.
 * Makes an API call to retrieve the reimbursement ticket with the
 * id specified in the route query parameter 'reimbursementId'.
 * Updates the `currentReimbursement` reactive reference with the retrieved
 * data.
 */
async function userIsUpdatingReimbursement() {
  let reimbursement = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/retrieve-ticket-information`,
    {
      params: {
        reimbursementId: route.query.reimbursementId,
      },
    }
  );

  currentReimbursement.value = reimbursement.data;
}

// const debounceAutoSave = debounce(autosaveData, 10000);

const autosave_label = ref<boolean>(false);

/**
 * Autosaves the current reimbursement ticket data.
 * Sends a POST request to update the reimbursement ticket with the current
 * data stored in `currentReimbursement`. Displays an "Autosaved" label
 * momentarily after the data is successfully sent.
 */

async function autosaveData() {
  console.log("Autosaved");
  await axios.post(`${import.meta.env.VITE_API_URL}/api/update-reimbursement`, {
    reimbursementTicket: currentReimbursement.value,
  });

  autosave_label.value = true;

  setTimeout(() => {
    autosave_label.value = false;
  }, 3000);
}

let initialLoad = true;

watch(
  currentReimbursement,
  (news, old) => {
    if (initialLoad) {
      initialLoad = false;
      return;
    }

    //If user is updating a request, add autosave
    // mainly doing this because adding and updating call different apis, and adding a new one
    // would require the title and yeah dont wanna rework the adding/updating to a way that allows
    // autosave on both just yet
    if (route.query.reimbursementId) {
      // debounceAutoSave();
    }
  },
  {
    deep: true,
    immediate: false,
  }
);

onMounted(async () => {
  try {
    const previous = window.history.state?.from;
    if (previous === "foapa-page") {
      coming_from_foapa_page.value = true;
    }

    if (route.query.reimbursementId) {
      await userIsUpdatingReimbursement();

      // Open in view-only mode
      if (
        currentReimbursement.value.reimbursementStatus === "Approved" ||
        currentReimbursement.value.reimbursementStatus === "Approved*" ||
        currentReimbursement.value.reimbursementStatus === "Submitted"
      ) {
        view_only_mode.value = true;
      }

      // Show the view edit notes if denied

      // if(currentReimbursement.value.reimbursementStatus === "Denied")
    } else if (route.query.templateData) {
      currentReimbursement.value = JSON.parse(
        route.query.templateData as string
      );

      // Clearing the id properties from mongo so it doesnt throw duplicate errors
      if (currentReimbursement.value._id) {
        delete currentReimbursement.value._id;
      }

      if (currentReimbursement.value.activities) {
        currentReimbursement.value.activities.forEach((actv) => {
          delete actv._id;
        });
      }

      if (currentReimbursement.value.guestInformation) {
        currentReimbursement.value.guestInformation.forEach((guest) => {
          // @ts-expect-error
          delete guest._id;
        });
      }
    }
    startListeningForReimbursementChanges();
  } catch (err) {
    console.log(err);
  }
});

function discardChangesAndLeavePage() {
  user_has_unsaved_changes.value = false;
  router.push("/dashboard");
}

function goBack() {
  show_confirm_dialog.value = false;
}

function viewRequestHistory() {
  request_history_sidebar_is_visible.value = true;
  console.log(currentReimbursement.value.request_history);
}

onBeforeRouteLeave((to, from, next) => {
  if (user_has_unsaved_changes.value === true) {
    show_confirm_dialog.value = true;
    next(false);
  } else {
    next();
  }
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>

<style>
.p-step-active .p-step-title {
  color: var(--udmercy-blue) !important;
}

.p-step-active .p-step-number {
  color: var(--udmercy-blue) !important;
}

.p-step:has(~ .p-step-active) .p-stepper-separator {
  background: var(--udmercy-blue) !important;
}

.p-step:nth-child(1) {
  padding-left: 0px !important;
}
</style>
