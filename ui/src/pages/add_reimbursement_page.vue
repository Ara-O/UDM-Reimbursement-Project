<template>
  <!-- Top section for returning -->
  <div class="flex items-center gap-4 absolute top-8 left-32 cursor-pointer" @click="goToDashboard">
    <img src="../assets/left-arrow.png" alt="Left arrow" class="w-4">
    <h4 class="font-normal text-sm text-gray-600">Return to dashboard</h4>
  </div>
  <main class="h-screen flex items-center gap-20">
    <!-- SECTIONS SECTION -->
    <section class="pl-32">
      <h3 class="text-2xl font-semibold">Section</h3>
      <article class="shadow h-auto border-black border rounded-md w-[22rem] mt-8">
        <div v-for="section in sections">
          <div class="h-20 w-100 flex justify-between items-center box-border px-10"
            @click="changeSection(section.section)">
            <h4 class="font-normal text-sm">{{ section.title }}</h4>
            <img src="../assets/right-arrow.png" alt="Next arrow"
              class="hover:contrast-50 w-4 transition-all duration-500"
              :class="{ ' contrast-0': selectedSection != section.section }">
          </div>
          <hr class="border-solid border-[0.5px] text-gray-200 h-[1] m-0">
        </div>
      </article>
    </section>

    <!-- INFO SECTION -->
    <section>
      <claim-information :claim="currentReimbursement" v-if="selectedSection === 1"
        @move-to-next-section="selectedSection++"></claim-information>
      <manage-expenses :claim="currentReimbursement" v-if="selectedSection === 2"
        @move-to-next-section="selectedSection++"></manage-expenses>
      <assign-foapa-information v-if="selectedSection === 3"></assign-foapa-information>
      <manage-receipts :claim="currentReimbursement" v-if="selectedSection === 4"
        @move-to-next-section="selectedSection++"></manage-receipts>
      <guest-information :claim="currentReimbursement" v-if="selectedSection === 5"
        @move-to-next-section="selectedSection++"></guest-information>
      <finish :claim="currentReimbursement" v-if="selectedSection === 6"></finish>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import { ReimbursementTicket } from "../types/types";
import claimInformation from "../components/add-reimbursement/ClaimInformation.vue"
import manageExpenses from "../components/add-reimbursement/ManageExpenses.vue"
import GuestInformation from "../components/add-reimbursement/GuestInformation.vue";
import ManageReceipts from "../components/add-reimbursement/ManageReceipts.vue";
import Finish from "../components/add-reimbursement/Finish.vue";
import AssignFoapaInformation from "../components/add-reimbursement/AssignFoapaInformation.vue";
import parseDate from "../utils/parseDate";

function goToDashboard() {
  router.push('/')
}

const router = useRouter()
const route = useRoute()

let selectedSection = ref<number>(1)

let sections = ref([
  {
    title: "Claim Information",
    section: 1
  },
  {
    title: "Add or View Expenses",
    section: 2
  },
  {
    title: "Assign FOAPA Information",
    section: 3
  },
  {
    title: "Manage Receipts",
    section: 4
  },
  {
    title: "Optional: Guest Information",
    section: 5
  },
  {
    title: "Finish",
    section: 6
  }
])

function changeSection(section: number) {
  selectedSection.value = section;
}

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
  guestInformation: []
});

async function userIsUpdatingReimbursement() {
  let reimbursement = await axios.get(
    "https://udm-reimbursement-project.onrender.com/api/retrieveTicketInformation",
    {
      params: {
        reimbursementId: route.query.reimbursementId,
      },
    }
  );

  currentReimbursement.value = reimbursement.data;
}

onMounted(() => {
  if (route.query.reimbursementId) {
    userIsUpdatingReimbursement();
  } else if (route.query.templateData) {
    currentReimbursement.value = JSON.parse(route.query.templateData as string)

    // Clearing the id properties from mongo so it doesnt throw duplicate errors
    // @ts-expect-error
    if (currentReimbursement.value._id) {
      //@ts-expect-error
      delete currentReimbursement.value._id
    }

    if (currentReimbursement.value.activities) {
      currentReimbursement.value.activities.forEach((actv) => {
        delete actv._id
      })
    }

    if (currentReimbursement.value.guestInformation) {
      currentReimbursement.value.guestInformation.forEach((guest) => {
        // @ts-expect-error
        delete guest._id
      })
    }

  }
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
