<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <activities-list
        :current-reimbursement="currentReimbursement"
        :user-is-editing-reimbursement="userIsEditingReimbursement"
        @user-is-editing-activity="userIsEditingActivity"
      ></activities-list>
    </section>
    <section class="reimbursement-section">
      <article>
        <reimbursement-specific-section
          :current-reimbursement="currentReimbursement"
        ></reimbursement-specific-section>
        <div class="divider"></div>
        <activity-specific-section
          :current-reimbursement="currentReimbursement"
          :current-activity="currentActivity"
          :user-is-editing-activity="userIsEditingActivityFlag"
          @user-has-finished-editing-activity="
            userIsEditingActivityFlag = false
          "
        ></activity-specific-section>
      </article>
      <article>
        <add-receipt-section
          :current-reimbursement="currentReimbursement"
        ></add-receipt-section>
      </article>
    </section>
  </section>
</template>

<script lang="ts" setup>
import ActivitiesList from "../components/add-reimbursement/ActivitiesListSection.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { ReimbursementTicket, Activity } from "../types/types";
import parseDate from "../utils/parseDate";
import axios from "axios";
import ReimbursementSpecificSection from "../components/add-reimbursement/ReimbursementSpecificSection.vue";
import ActivitySpecificSection from "../components/add-reimbursement/ActivitySpecificSection.vue";
import AddReceiptSection from "../components/add-reimbursement/AddReceiptSection.vue";
const route = useRoute();
import { generateRandomStringId } from "../utils/generateRandomId";

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

let currentActivity = ref<Activity>({
  activityName: "",
  cost: 0,
  activityDate: "",
  activityReceipt: "",
  foapaNumber: "",
  activityId: generateRandomStringId(24),
});

let userIsEditingReimbursement = ref<boolean>(false);
let userIsEditingActivityFlag = ref<boolean>(false);

function userIsEditingActivity(activityId: String) {
  const activity = currentReimbursement.value.activities.find(
    (activity) => activity.activityId === activityId
  );

  if (activity) {
    activity.activityDate = parseDate(activity.activityDate);
    currentActivity.value = Object.assign({}, activity);
    userIsEditingActivityFlag.value = true;
  }
}

async function userIsUpdatingReimbursement() {
  userIsEditingReimbursement.value = true;
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
  }
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
