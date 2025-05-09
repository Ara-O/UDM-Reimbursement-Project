<template>
  <!-- Top section for returning -->
  <div
    class="flex items-center gap-4 absolute top-8 sm:ml-20 ml-10 xl:ml-32 cursor-pointer"
    @click="goToDashboard"
  >
    <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
    <h4 class="font-normal text-sm text-gray-600">Return to dashboard</h4>
  </div>
  <span
    class="absolute right-10 top-11 flex cursor-pointer items-center gap-4"
    @click="request_history_sidebar_is_visible = true"
  >
    <img :src="HistoryIcon" alt="History" class="w-5" />
    <p class="text-udmercy-blue underline">Request History</p>
  </span>
  <main class="h-screen block xl:flex mt-40 xl:mt-0 items-center gap-20">
    <!-- SECTIONS SECTION -->
    <section class="pl-32 hidden xl:block">
      <h3 class="text-2xl font-semibold">Section</h3>
      <article
        class="shadow h-auto border-black border rounded-md w-[22rem] mt-8"
      >
        <div v-for="(section, i) in sections">
          <div
            class="h-20 w-100 flex justify-between items-center box-border px-10 hover:bg-[#002d72EE] hover:text-gray-100 cursor-pointer"
            :class="{
              'rounded-tl-sm rounded-tr-sm': i == 0,
              'rounded-bl-sm rounded-br-sm': i == sections.length - 1,
              'bg-[#002d72EE] text-white': selectedSection == section.section,
            }"
            @click="changeSection(section.section)"
          >
            <h4 class="font-normal text-sm">{{ section.title }}</h4>
            <img
              src="../assets/next-arrow.png"
              alt="Next arrow"
              class="hover:contrast-50 w-4 transition-all duration-500"
              :class="{
                ' contrast-0': selectedSection != section.section,
                '': selectedSection == section.section,
              }"
            />
          </div>
          <hr class="border-solid border-[0.5px] text-gray-200 h-[1] m-0" />
        </div>
      </article>
    </section>

    <!-- INFO SECTION -->
    <section class="w-auto">
      <claim-information
        :claim="currentReimbursement"
        :view_only_mode="false"
        v-if="selectedSection === 1"
        @move-to-next-section="moveToNextSection"
      ></claim-information>
      <manage-expenses
        :claim="currentReimbursement"
        :view_only_mode="false"
        v-if="selectedSection === 2"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></manage-expenses>
      <assign-foapa-information-admin
        :claim="currentReimbursement"
        :faculty_id="String(route.query.facultyId)"
        v-if="selectedSection === 3"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></assign-foapa-information-admin>
      <manage-receipts
        :claim="currentReimbursement"
        v-if="selectedSection === 4"
        :view_only_mode="false"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></manage-receipts>
      <add-edit-notes
        v-if="selectedSection === 5"
        :old-reimbursement="currentReimbursement"
        :new-reimbursement="oldReimbursement"
        @approve-request-with-edits="approveRequestWithEdits"
        @save-request-with-edits="saveRequestWithEdits"
      >
      </add-edit-notes>
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
    <div class="card flex justify-content-center">
      <Sidebar
        v-model:visible="request_history_sidebar_is_visible"
        header="Request History"
        position="right"
      >
        <div v-for="history in currentReimbursement.request_history">
          <p class="mb-2 leading-7">{{ history.request_message }}</p>
          <p class="text-sm mt-0 text-gray-500">
            {{ history.date_of_message }}
          </p>
          <hr class="text-gray-200 h-0.5 bg-gray-200 border-solid" />
        </div>
      </Sidebar>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { ReimbursementTicket } from "../types/types";
import claimInformation from "../components/add-reimbursement/ClaimInformation.vue";
import manageExpenses from "../components/add-reimbursement/ManageExpenses.vue";
import ManageReceipts from "../components/add-reimbursement/ManageReceipts.vue";
import AssignFoapaInformationAdmin from "../components/add-reimbursement/AssignFoapaInformationAdmin.vue";
import ConfirmationPopup from "../components/utilities/ConfirmationPopup.vue";
import AddEditNotes from "../components/AdminAddEditNotes.vue";
import { TYPE, useToast } from "vue-toastification";
import Button from "primevue/button";
import HistoryIcon from "../assets/black-history.png";
import Sidebar from "primevue/sidebar";
function goToDashboard() {
  router.push("/admin");
}

const router = useRouter();
const route = useRoute();
const toast = useToast();

let show_confirm_dialog = ref<boolean>(false);
let user_has_unsaved_changes = ref<boolean>(false);
let claim_is_being_saved = ref<boolean>(false);
let selectedSection = ref<number>(1);
let request_history_sidebar_is_visible = ref<boolean>(false);
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
    title: "Add Edit Notes",
    section: 5,
  },
]);

/**
 * Saves the reimbursement request with provided edit notes.
 *
 * This function sends a POST request to the server to save the
 * reimbursement request with the specified edit notes. Upon a
 * successful save, it displays a success toast message and
 * redirects the user to the admin page. If an error occurs during
 * the process, it displays an error toast message.
 *
 * @param {string} edit_notes - The notes detailing the edits made
 * to the reimbursement request.
 */

async function saveRequestWithEdits(edit_notes) {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/save-request-with-edits`,
      {
        edit_notes: edit_notes,
        reimbursement_data: currentReimbursement.value,
        faculty_id: route.query.facultyId,
      }
    );

    toast.clear();
    toast("Request saved successfully", {
      type: TYPE.SUCCESS,
    });

    router.push("/admin");
  } catch (err) {
    toast.clear();
    toast("There was an error approving this request. Please try again later", {
      type: TYPE.ERROR,
    });
    console.log(err);
  }
}

/**
 * Changes the current section to the specified section number.
 *
 * @param {number} section - The section number to change to.
 */
function changeSection(section: number) {
  selectedSection.value = section;
}

let oldReimbursement = ref<ReimbursementTicket>();

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

/**
 * Approves the reimbursement request with specified edit notes.
 *
 * This function sends a POST request to approve the reimbursement request,
 * using the provided edit notes. Upon a successful approval, it displays a
 * success toast message and redirects the user to the admin page. If an error
 * occurs during the process, it displays an error toast message.
 *
 * @param {string} edit_notes - The notes detailing the edits made to the
 * reimbursement request.
 */

/**
 * Approves the reimbursement request with specified edit notes.
 *
 * This function sends a POST request to approve the reimbursement request,
 * using the provided edit notes. Upon a successful approval, it displays a
 * success toast message and redirects the user to the admin page. If an error
 * occurs during the process, it displays an error toast message.
 *
 * @param {string} edit_notes - The notes detailing the edits made to the
 * reimbursement request.
 */
async function approveRequestWithEdits(edit_notes) {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/admin/approve-request-with-edits`,
      {
        edit_notes: edit_notes,
        reimbursement_data: currentReimbursement.value,
        faculty_id: route.query.facultyId,
      }
    );

    toast.clear();
    toast("Request approved successfully", {
      type: TYPE.SUCCESS,
    });

    router.push("/admin");
  } catch (err) {
    toast.clear();
    toast("There was an error approving this request. Please try again later", {
      type: TYPE.ERROR,
    });
    console.log(err);
  }
}

function startListeningForReimbursementChanges() {
  watch(currentReimbursement.value, () => {
    if (claim_is_being_saved.value === false) {
      user_has_unsaved_changes.value = true;
    }
  });
}

onMounted(async () => {
  try {
    if (!route.query.reimbursementId || !route.query.facultyId) {
      router.push("/admin");
    }

    startListeningForReimbursementChanges();

    let reimbursement = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/retrieve-ticket-information`,
      {
        params: {
          reimbursementId: route.query.reimbursementId,
        },
      }
    );

    currentReimbursement.value = reimbursement.data as ReimbursementTicket;
    oldReimbursement.value = Object.assign({}, currentReimbursement.value);
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
