<template>
  <!-- Top section for returning -->
  <span
    class="absolute right-10 top-11 flex cursor-pointer items-center gap-4"
    @click="viewRequestHistory"
  >
    <img :src="HistoryIcon" alt="History" class="w-5" />
    <p class="text-udmercy-blue underline">Request History</p>
  </span>
  <div
    class="flex items-center gap-4 absolute top-8 sm:ml-20 ml-10 xl:ml-32 cursor-pointer"
    @click="goToDashboard"
  >
    <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4" />
    <h4 class="font-normal text-sm text-gray-600">Return to dashboard</h4>
  </div>
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
        v-if="selectedSection === 1"
        @move-to-next-section="moveToNextSection"
      ></claim-information>
      <manage-expenses
        :claim="currentReimbursement"
        v-if="selectedSection === 2"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></manage-expenses>
      <assign-foapa-information
        :claim="currentReimbursement"
        v-if="selectedSection === 3"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></assign-foapa-information>
      <manage-receipts
        :claim="currentReimbursement"
        v-if="selectedSection === 4"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></manage-receipts>
      <!-- <guest-information
        :claim="currentReimbursement"
        v-if="selectedSection === 5"
        @move-to-next-section="moveToNextSection"
        @move-to-previous-section="moveToPreviousSection"
      ></guest-information> -->
      <finish
        :claim="currentReimbursement"
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
    </Sidebar>
    <Button
      icon="pi pi-arrow-right"
      @click="request_history_sidebar_is_visible = true"
    ></Button>
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
import { debounce } from "lodash";

function goToDashboard() {
  router.push("/");
}

const router = useRouter();
const route = useRoute();

let show_confirm_dialog = ref<boolean>(false);
let user_has_unsaved_changes = ref<boolean>(false);
let claim_is_being_saved = ref<boolean>(false);
let selectedSection = ref<number>(1);
const request_history_sidebar_is_visible = ref<boolean>(false);

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
  // {
  //   title: "Guest Information (Optional)",
  //   section: 5,
  // },
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

function getAllActivitiesAmount(): number {
  let sum: number = 0;
  currentReimbursement.value.activities.forEach((activity) => {
    sum += Number(activity.cost);
  });
  return sum;
}

const autosave_label = ref<boolean>(false);
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
    if (route.query.reimbursementId) {
      await userIsUpdatingReimbursement();
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
