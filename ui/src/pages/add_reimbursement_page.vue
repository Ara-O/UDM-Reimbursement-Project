<template>
  <section class="add-reimbursement-section">
    <section class="all-activities-section">
      <activities-list
        :current-reimbursement="currentReimbursement"
        :user-is-editing-reimbursement="userIsEditingReimbursement"
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
import { ReimbursementTicket } from "../types/types";
import parseDate from "../utils/parseDate";
import axios from "axios";
import ReimbursementSpecificSection from "../components/add-reimbursement/ReimbursementSpecificSection.vue";
import ActivitySpecificSection from "../components/add-reimbursement/ActivitySpecificSection.vue";
import AddReceiptSection from "../components/add-reimbursement/AddReceiptSection.vue";
const route = useRoute();

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

let userIsEditingReimbursement = ref<boolean>(false);

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

onMounted(() => {
  if (route.query.reimbursementId) {
    userIsUpdatingReimbursement();
  }
});
</script>

<style scoped>
@import url("../assets/styles/add-reimbursement-page.css");
</style>
