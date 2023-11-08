<template>
  <!-- Top section for returning -->
  <div class="flex items-center gap-4 absolute top-8 left-32">
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
            <img src="../assets/right-arrow.png" alt="Next arrow" class="w-4"
              :class="{ ' contrast-0': selectedSection != section.section }">
          </div>
          <hr class="border-solid border-[0.5px] text-gray-200 h-[1] m-0">
        </div>
      </article>
    </section>

    <!-- INFO SECTION -->
    <section>
      <claim-information v-if="selectedSection === 1"></claim-information>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import claimInformation from "../components/add-reimbursement/ClaimInformation.vue"
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
// import ActivitiesList from "../components/add-reimbursement/ActivitiesListSection.vue";
// import { onMounted, ref, watch } from "vue";
// import { useRoute, useRouter } from "vue-router";
// import { ReimbursementTicket, Activity } from "../types/types";
// import parseDate from "../utils/parseDate";
// import axios from "axios";
// import ReimbursementSpecificSection from "../components/add-reimbursement/ReimbursementSpecificSection.vue";
// import ActivitySpecificSection from "../components/add-reimbursement/ActivitySpecificSection.vue";
// import AddReceiptSection from "../components/add-reimbursement/AddReceiptSection.vue";
// import { generateRandomStringId } from "../utils/generateRandomId";

// const router = useRouter();
// const route = useRoute();

// let currentReimbursement = ref<ReimbursementTicket>({
//   reimbursementName: "",
//   totalCost: 0,
//   reimbursementReason: "",
//   reimbursementStatus: "",
//   reimbursementDate: parseDate(new Date().toISOString()),
//   activities: [],
//   reimbursementReceipts: [],
//   destination: "",
//   paymentRetrievalMethod: "Direct Deposit",
//   UDMPUVoucher: false,
//   guest: false,
//   employeeFirstName: "",
//   employeeLastName: "",
//   guestFirstName: "",
//   guestLastName: "",
//   guestAssociation: "",
// });

// let currentActivity = ref<Activity>({
//   activityName: "",
//   cost: 0,
//   activityDate: "",
//   activityReceipt: "",
//   foapaNumber: "",
//   activityId: generateRandomStringId(24),
// });

// let userIsEditingReimbursement = ref<boolean>(false);
// let userIsEditingActivityFlag = ref<boolean>(false);

// function userIsEditingActivity(activityId: String) {
//   const activity = currentReimbursement.value.activities.find(
//     (activity) => activity.activityId === activityId
//   );

//   if (activity) {
//     activity.activityDate = parseDate(activity.activityDate);
//     currentActivity.value = Object.assign({}, activity);
//     userIsEditingActivityFlag.value = true;
//   }
// }

// async function userIsUpdatingReimbursement() {
//   userIsEditingReimbursement.value = true;
//   let reimbursement = await axios.get(
//     "https://udm-reimbursement-project.onrender.com/api/retrieveTicketInformation",
//     {
//       params: {
//         reimbursementId: route.query.reimbursementId,
//       },
//     }
//   );

//   currentReimbursement.value = reimbursement.data;
// }

// onMounted(() => {
//   if (
//     localStorage.getItem("token") === null ||
//     localStorage.getItem("token") === ""
//   ) {
//     console.log("User not signed in");
//     router.push("/");
//   }
//   if (route.query.reimbursementId) {
//     userIsUpdatingReimbursement();
//   }
// });
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
